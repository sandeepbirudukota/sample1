const con = require("../db");
const { 
  v4: uuidv4,
} = require('uuid');

const tableName = "orders";
const orderItemTableName = "orderitem";
const cartTableName = "cart";
const itemTableName = "item";
const shopTableName = "shop";


class Order{

    static getOrderItems = async ({userId})=>{
        return new Promise((resolve, reject) => {
            const getUserOrdersSqlQuery = `select * from ${tableName} WHERE userId='${userId}' `;
            con.query(getUserOrdersSqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }else if(results && results.length){
                    const orderIds = results.map((eachOrder)=>{
                        return eachOrder.orderId;
                    });
                    let orderIdsQuery = "(";
                    orderIds.forEach((orderId,index) => {
                        if(orderIds.length-1==index){
                            orderIdsQuery+="\'"+orderId+"\'";
                        }else{
                            orderIdsQuery+="\'"+orderId+"\'"+", ";
                        }
                    });
                    orderIdsQuery+=")";
                    const sqlQuery = `select * from ${orderItemTableName} where orderId IN ${orderIdsQuery} ORDER BY date DESC`;
                    con.query(sqlQuery, (error, results) => {
                        if (error) {
                            console.log(error);
                            return reject(error);
                        }else if(results){
                            results.forEach((eachItem)=>{
                                let date = new Date(eachItem.date);
                                let year = date.getFullYear();
                                let month = date.getMonth()+1;
                                let dt = date.getDate();
                                if (dt < 10) {
                                dt = '0' + dt;
                                }
                                if (month < 10) {
                                month = '0' + month;
                                }
                                eachItem.date = month+"/"+dt+"/"+year;
                            })
                            console.log(results);
                            return resolve(results);
                        }else{
                            return reject("Some unexpected error occurred!");
                        }
                    });
                }else{
                    resolve([]);
                }
            });
        });
    }

    static placeOrder = async ({userId})=>{
        return new Promise((resolve, reject) =>{
            con.getConnection(function(err, poolConnection){
                if(err){
                    console.log(err);
                    throw Error("Some unexpected error occurred");
                }else{
                    poolConnection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED', (err,result)=>{
                        if(err){
                            console.log(err);
                            throw Error("Some unexpected error occurred");
                        }else{
                             poolConnection.beginTransaction((err, result)=>{
                                const getUserCartItemsQuery = `select * from ${cartTableName} WHERE userId='${userId}'`;
                                poolConnection.query(getUserCartItemsQuery, (error, cartItemResults) => {
                                    if (error) {
                                        poolConnection.rollback((err,result)=>{
                                            if(err){
                                                return reject(err);
                                            }else{
                                                return reject(error);
                                            }
                                        });
                                    }else if(cartItemResults){
                                        const cartItems = cartItemResults;
                                        const cartItemIds = cartItems.map((eachCartItem)=>{
                                            return eachCartItem.itemId;
                                        })
                                        console.log("puka cart id's " + cartItems)
                                        let itemIdsQuery = "(";
                                        cartItemIds.forEach((cartItemId,index) => {
                                            if(cartItemIds.length-1==index){
                                                itemIdsQuery+="\'"+cartItemId+"\'";
                                            }else{
                                                itemIdsQuery+="\'"+cartItemId+"\'"+", ";
                                            }
                                        });
                                        itemIdsQuery+=")";

                                        console.log("puka item id query: "+ itemIdsQuery)
                                        const getItemsQuery = `select ${itemTableName}.id as itemId, ${itemTableName}.name as itemName, ${itemTableName}.displaypicture as itemDisplayPicture,${itemTableName}.category as itemCategory,${itemTableName}.description as description, ${itemTableName}.price as itemPrice,${itemTableName}.quantity as itemQuantity, ${itemTableName}.salescount as itemSalesCount, ${itemTableName}.shop as shop, ${shopTableName}.name as shopName from ${itemTableName} INNER JOIN ${shopTableName} ON ${itemTableName}.shop=${shopTableName}.id where ${itemTableName}.id IN ${itemIdsQuery}`;
                                        poolConnection.query(getItemsQuery, (error, itemResults) => {
                                            if (error) {
                                                console.log(error);
                                                return reject(error);
                                            }else if(itemResults){
                                                const items = itemResults;
                                                const updatedItems = [];
                                                cartItems.forEach((eachCartItem)=>{
                                                    let item = items.filter((eachItem)=>{
                                                        return eachCartItem.itemId==eachItem.itemId;
                                                    });
                                                    item = item[0];
                                                    if(item.itemQuantity<eachCartItem.orderQuantity){
                                                        return reject("Item out of stock");
                                                    }else{
                                                        item.itemQuantity-=eachCartItem.orderQuantity;
                                                        item.itemSalesCount+=eachCartItem.orderQuantity;
                                                        item.itemOrderQuantity=eachCartItem.orderQuantity;
                                                        item.itemDate = new Date();
                                                        updatedItems.push(item);
                                                    }
                                                });
                                                //const orderId = uuidv4();
                                                const createOrderQuery =  `INSERT INTO ${tableName} (userId) VALUES ("${userId}")`;
                                                poolConnection.query(createOrderQuery,(err,orderCreated)=>{
                                                    if(err){
                                                        return reject("Some unexpected error occurred createOrderQuery");
                                                    }else{
                                                        let orderId = orderCreated.insertId;
                                                        console.log('puka');
                                                        console.log(orderId)
                                                        console.log(orderCreated);
                                                        let createOrderItemsQuery = "";
                                                        let count =0
                                                        updatedItems.forEach((eachItem)=>{
                                                            console.log("puka 1 ")
                                                            console.log(eachItem)
                                                            const query = `INSERT INTO ${orderItemTableName} (name,displayPicture,price,orderQuantity,date,shopName,itemId) VALUES ("${eachItem.itemName}","${eachItem.itemDisplayPicture}",${eachItem.itemPrice},"${eachItem.itemOrderQuantity}",${poolConnection.escape(eachItem.itemDate)},"${eachItem.shopName}","${eachItem.itemId}");`;
                                                            count+=1;
                                                            createOrderItemsQuery+=query;
                                                        })
                                                        console.log(createOrderItemsQuery);
                                                        poolConnection.query(createOrderItemsQuery,(err,orderItemsCreated)=>{
                                                            if(err){
                                                                console.log(err);
                                                                return reject("Some unexpected error occurred");
                                                            }else{
                                                                let updateItemsQuery = "";
                                                                updatedItems.forEach((eachItem)=>{
                                                                    const query = `UPDATE ${itemTableName} SET quantity=${eachItem.itemQuantity}, salesCount=${eachItem.itemSalesCount} where id=${eachItem.itemId};`;
                                                                    updateItemsQuery+=query;
                                                                })
                                                                console.log(updateItemsQuery);
                                                                poolConnection.query(updateItemsQuery,(err, updatedItemsResult)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                        return reject("Some unexpected error occurred");
                                                                    }else{
                                                                        console.log(updatedItemsResult);
                                                                        const deleteUserCartQuery = `DELETE FROM ${cartTableName} WHERE userId="${userId}"`;
                                                                        con.query(deleteUserCartQuery,(err,deleteCartResult)=>{
                                                                            if(err){
                                                                                console.log(err);
                                                                                return reject("Some unexpected error occurred");
                                                                            }else{
                                                                            poolConnection.commit((err,commitResult)=>{
                                                                                    if(err){
                                                                                        console.log(err);
                                                                                        return reject("Some unexpected error occurred");
                                                                                    }else{
                                                                                        resolve(commitResult);
                                                                                    }
                                                                            }) 
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                });
                                            }else{
                                                return reject("Some unexpected error occurred!");
                                            }
                                        });
                                    }else{
                                        return reject("Some unexpected error occurred!");
                                    }
                                });
                            });
                        }
                    })
                   
                }
            });
        })
        
    }
}

module.exports.Order = Order;