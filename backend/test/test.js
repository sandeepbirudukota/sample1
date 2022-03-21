const axios = require("axios");
const assert = require("assert");


const apiUrl = "http://localhost:3000/api";

let userJWT = "";
let userId = "";
let shopId = "";
describe("POST - login api", () => {
  it("/login/", (done) => {
    axios
      .post(apiUrl + "/login/", { email: "sriram4art@gmail.com", password: "Sriram@123" })
      .then((response) => {
        console.log(response.data);
        assert.equal(response.status, 200);
        assert.equal(response.data.success,true);
        assert.equal(response.data.user.name,"Sriram");
        assert.equal(response.data.user.id,'894b2fb7-3557-4bbd-b107-73e46c88d2b1');
        userJWT = response.data.user.token;
        userId = response.data.user.id;
        shopId = response.data.user.shop;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("GET - user categories api", () => {
  it("/category/", (done) => {
    axios
      .get(apiUrl + `/category/${userId}`,{headers:{
        Authorization: `Bearer ${userJWT}`
    }})
      .then((response) => {
        console.log(response.data);
        assert.equal(response.status, 200);
        assert.equal(response.data.success,true);
        assert.equal(response.data.categories.length,2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("POST - user shop api", () => {
  it("/shop/", (done) => {
    axios
      .post(apiUrl + `/shop/home`,{userId:userId,shopId:shopId},{headers:{
        Authorization: `Bearer ${userJWT}`
    }})
      .then((response) => {
        console.log(response.data);
        assert.equal(response.status, 200);
        assert.equal(response.data.success,true);
        assert.equal(response.data.shopFound,true);
        assert.equal(response.data.editRights,true);
        assert.equal(response.data.shopItems.length,1);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("POST - home page items api", () => {
  it("/item/", (done) => {
    axios
      .post(apiUrl + `/item/other`,{id:userId,shop:shopId},{headers:{
        Authorization: `Bearer ${userJWT}`
    }})
      .then((response) => {
        console.log(response.data);
        assert.equal(response.status, 200);
        assert.equal(response.data.success,true);
        //assert.notEqual(response.data.items.length,0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("GET - user cart item api", () => {
  it("/cart/", (done) => {
    axios
      .get(apiUrl + `/cart/get/${userId}`,{headers:{
        Authorization: `Bearer ${userJWT}`
    }})
      .then((response) => {
        console.log(response.data);
        assert.equal(response.status, 200);
        assert.equal(response.data.success,true);
        //assert.notEqual(response.data.items.length,0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});