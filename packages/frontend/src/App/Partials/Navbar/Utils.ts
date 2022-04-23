import { NavigationType } from './Keys';


export const enableNavItem = (type: NavigationType, inNavigation: boolean, inFooter: boolean): boolean => {
  switch (type) {
    case NavigationType.Navbar:
      return inNavigation;
    case NavigationType.Footer:
      return inFooter;
    case NavigationType.Admin: 
      return true;
    default:
      return false;
  }
}

export const utils = {
  enableNavItem,
}

export default utils;