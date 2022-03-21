import React from "react";
import { render, screen, fireEvent,act } from "@testing-library/react";
import ViewProfile from "../components/ViewProfile";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

const server = setupServer(
  rest.get('http://localhost:3000/api/currency', (req, res, ctx) => {
    console.log("currency=======");
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


test("testing view profile page", async () => {
//   render(
//     <React.StrictMode>
//       <BrowserRouter>
//           <ViewProfile />
//       </BrowserRouter>
//     </React.StrictMode>
//   );

//   const profilePicture = screen.getByTestId("profile-pic");
//   const userEmail = screen.getByTestId("user-email");
//   const userGender = screen.getByTestId("user-gender");
//   const userDob = screen.getByTestId("user-dob");
//   const userPhone = screen.getByTestId("user-phone");
//   const userAddress = screen.getByTestId("user-address");
//   const userCity = screen.getByTestId("user-city");
//   const userAbout = screen.getByTestId("user-about");

//   expect(profilePicture).toBeInTheDocument();
//   expect(userEmail).toBeInTheDocument();
//   expect(userGender).toBeInTheDocument();
//   expect(userDob).toBeInTheDocument();
//   expect(userPhone).toBeInTheDocument();
//   expect(userAddress).toBeInTheDocument();
//   expect(userCity).toBeInTheDocument();
//   expect(userAbout).toBeInTheDocument();
});