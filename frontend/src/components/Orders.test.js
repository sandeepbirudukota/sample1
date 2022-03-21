import React from "react";
import { render, screen, fireEvent,act } from "@testing-library/react";
import Orders from "../components/Orders";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

const server = setupServer(
  rest.get('http://localhost:3000/api/order/get/:id', (req, res, ctx) => {
    console.log("order=======");
  }),
  
  rest.get('http://localhost:3000/api/currency/:id', (req, res, ctx) => {
    console.log("currency=======");
    return res(ctx.json({success:true,currency:{id:1,name:"USD"}}));
  }),

  rest.get('http://localhost:3000/api/country', (req, res, ctx) => {
    console.log("country=======");
  }),

  rest.post('http://localhost:3000/api/user/', (req, res, ctx) => {
    console.log("user=======");
  }),
)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


test("testing orders page", async () => {
    localStorage.setItem("token","token");
    localStorage.setItem("user",JSON.stringify({userId:1,userName:"testset"}));
  render(
    <React.StrictMode>
      <BrowserRouter>
          <Orders />
      </BrowserRouter>
    </React.StrictMode>
  );
});