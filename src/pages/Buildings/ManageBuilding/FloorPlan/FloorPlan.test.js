import React from "react";
import { unmountComponentAtNode } from "react-dom";
import {render, screen} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import FloorPlan from "./FloorPlan";
import {Provider} from "react-redux";
import {store} from "../../../../store";
import {getFloorPlan} from "./Mock/MockData";

import Router from "react-router-dom";

const mockParams = {
  buildingId: ':buildingId',
  floorId: ':floorId',
}

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  // jest.spyOn(withRouter, 'useParams').mockReturnValue(mockParams)
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock('./Mock/MockData', () => ({
  getFloorPlan: jest.fn(),
}))


describe('Floor Plan Test', () => {
  test('Empty floor plan renders successfully', async () => {
    const fakeFloorPlan = null;

    jest.spyOn(Router, 'useParams').mockReturnValue(mockParams)
    getFloorPlan.mockImplementation(() => Promise.resolve(fakeFloorPlan));

    await act(async() => {
      render(<Provider store={store}><FloorPlan/></Provider>, container);
    })
    // expect(container.querySelector("h2").textContent).toBe('You haven\'t uploaded a floor plan to this floor yet');
    // expect(screen.queryByRole('missing-text')).toHaveTextContent('You haven\'t uploaded a floor plan to this floor yet');
  })
})