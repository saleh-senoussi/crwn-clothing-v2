import { fireEvent, screen } from "@testing-library/react";
import { ReactReduxContext, useDispatch } from "react-redux";
import { USER_ACTION_TYPES } from "../../../store/user/user.types";
import { renderWithProviders } from "../../../utils/test/test.utils";
import Navigation from "../navigation.component";
import * as userAction from "../../../store/user/user.action";
import * as reactRedux from 'react-redux';

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: jest.fn(),
}));

describe('Navigation tests', () => {
    const useDispatchMock = reactRedux.useDispatch;
    beforeEach(() => {
        useDispatchMock.mockImplementation(() => () => {});
    })
    afterEach(() => {
        useDispatchMock.mockClear();
    });

    test('It should render a Sign in link and not a Sign out link if there is no current user', () => {
        renderWithProviders(<Navigation />, {
            preloadedState: {
                user: {
                    currentUser: null
                }
            }
        });

        const signInLinkElement = screen.getByText(/Sign in/i);
        expect(signInLinkElement).toBeInTheDocument();

        const signOutLinkElement = screen.queryByText(/Sign out/i);
        expect(signOutLinkElement).toBeNull();
    });

    test('It should render a Sign out and not Sign in if there is current user', () => {
        renderWithProviders(<Navigation />, {
            preloadedState: {
                user: {
                    currentUser: {}
                }
            }
        });

        const signOutLinkElement = screen.getByText(/Sign out/i);
        expect(signOutLinkElement).toBeInTheDocument();

        const signInLinkElement = screen.queryByText(/Sign in/i);
        expect(signInLinkElement).toBeNull();
    });

    test('It should not render Cart dropdown if isCartOpen is false', () => {
        renderWithProviders(<Navigation />, {
            preloadedState: {
                cart: {
                    isCartOpen: false,
                    cartItems: []
                }
            }
        });

        const dropdownTextElement = screen.queryByText(/Your cart is empty/i);
        expect(dropdownTextElement).toBeNull();
    });

    test('It should display Cart dropdown when cart is open', () => {
        renderWithProviders(<Navigation />, {
            preloadedState: {
                cart: {
                    isCartOpen: true,
                    cartItems: []
                }
            }
        });

        const dropdownTextElement = screen.getByText(/Your cart is empty/i);
        expect(dropdownTextElement).toBeInTheDocument();
    });

    test('It should dispatch signOutStart action when clicking on the Sign out link', async() => {
        // const mockDispatch = jest.fn();
        // jest.spyOn(useDispatch, 'useDispatch').mockReturnValue(mockDispatch);

        renderWithProviders(<Navigation />, {
            preloadedState: {
                user: {
                    currentUser: {}
                }
            }
        });

        const signOutLinkElement=screen.getByText(/sign out/i);
        
        const signOutStartAction = jest.spyOn(userAction, 'signOutStart');
        expect(signOutLinkElement).toBeInTheDocument();
        await fireEvent.click(signOutLinkElement);
        expect(useDispatchMock).toHaveBeenCalled();
        expect(signOutStartAction).toHaveBeenCalled();
    })
})