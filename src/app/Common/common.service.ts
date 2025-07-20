import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Interfaces for type safety
interface ModuleData {
  moduleName: string;
  moduleId?: string;
}

interface FeatureData {
  featureCode: string;
  isChecked?: boolean;
  moduleId?: string;
}

interface UserCredential {
  roleName: string;
  permissions?: FeatureData[];
}

interface GeneralSetting {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  generalSettings: GeneralSetting | null = null;
  Modules: ModuleData[] = [];
  
  constructor(
    private router: Router
  ) {
    const generalSettingStr = sessionStorage.getItem("GeneralSetting");
    if (generalSettingStr) {
      try {
        this.generalSettings = JSON.parse(generalSettingStr);
      } catch (error) {
        console.error('Error parsing GeneralSetting from sessionStorage:', error);
      }
    }
  }

  DefaultCheckToViewModuleData(moduleData: ModuleData, getFeaturesByModuleId: FeatureData[], isCheck: boolean): FeatureData[] {
    let findFeatureIndx: number = -1;
    switch (moduleData.moduleName) {
      case "Dashboard":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "VIEW_DASHBOARD_MODULE");
        break;
      case "Settings":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_TABLE_DESIGNS");
        break;
      case "Menu":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_MENU");
        break;
      case "Stock":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_STOCK");
        break;
      case "Product":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_PRODUCT");
        break;
      case "Supplier":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_SUPPLIER");
        break;
      case "Supplier Order":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_SUPPLIER_ORDER");
        break;
      case "Batch Item":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_BATCH_ITEM");
        break;
      case "Dine In":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_DINE_IN");
        break;
      case "Online":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_ONLINE");
        break;
      case "Takeaway":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_TAKEAWAY");
        break;
      case "Kitchen":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_KITCHEN");
        break;
      case "Bar":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_BAR");
        break;
      case "Sales":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "BY_CATEGORY");
        break;
      case "Category":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_CATEGORY");
        break;
      case "Restaurant Sections":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_RESTAURANT_SECTION");
        break;
      case "Table Designs":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_TABLE_DESIGNS");
        break;
      case "Print Design":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_PRINT_DESIGNS");
        break;
      case "Restaurant":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_RESTAURANT");
        break;
      case "Tax":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_TAX");
        break;
      case "Modifiers":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_MODIFIERS");
        break;
      case "Discount":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_DISCOUNT");
        break;
      case "Promo Codes":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_PROMO_CODES");
        break;
      case "Roles & Permissions":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_ROLES_AND_PERMISSIONS");
        break;
      case "User Registration":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_USER_REGISTRATION");
        break;
      case "General Settings":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_GENERAL_SETTINGS");
        break;
      case "Loyality Settings":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_LOYALITY_SETTINGS");
        break;
      case "Shift Timings":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_SHIFT_TIMINGS");
        break;
      case "PettyCash":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_PETTYCASH");
        break;
      case "PaymentMode":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "LIST_PAYMENTMODE");
        break;
      case "Cash Counter":
        findFeatureIndx = getFeaturesByModuleId.findIndex((ele: FeatureData) => ele.featureCode == "VIEW_CASH_COUNTER");
        break;
    }
    
    if (findFeatureIndx !== -1) {
      getFeaturesByModuleId[findFeatureIndx].isChecked = isCheck;
    }
    return getFeaturesByModuleId;
  }

  checkRolePermissions(permissionType: string): boolean {
    const modulesStr = sessionStorage.getItem("ModulesMaster");
    const userCredentialStr = sessionStorage.getItem('userCredential');
    
    if (!modulesStr || !userCredentialStr) {
      return false;
    }

    try {
      this.Modules = JSON.parse(modulesStr);
      const UserData: UserCredential = JSON.parse(userCredentialStr);

      //If login user has Super Admin role, then bypass the roles&permissions check
      if (UserData.roleName == 'Super Admin') {
        return true;
      } else {
        //If not, check roles & permissions check for other users
        const result = UserData.permissions?.find((x: FeatureData) => x.featureCode == permissionType);
        if (result !== undefined && result !== null) {
          return result.isChecked || false;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error('Error parsing sessionStorage data:', error);
      return false;
    }
  }


  // NavigateUserBasedOnPermissions() {
  //   let UserData = JSON.parse(sessionStorage.getItem('userCredential'));
  //   let path: any;
  //   for (let i = 0; i < UserData.permissions.length; i++) {
  //     path = this.callNavigationBlock(UserData.permissions[i].featureCode);
  //     if (path != "")
  //       break;
  //   }
  //   return path;
  // }


  callNavigationBlock(featureCode: string): string {
    //Navigate
    let path = "";
    switch (featureCode) {
      case "LIST_CATEGORY":
        //this.router.navigate(['/pos-dashboard/dine-in']);
        path = '/pos-dashboard/admin-category';
        break;
      case "LIST_RESTAURANT_SECTION":
        path = '/pos-dashboard/masters-table-type';
        break;
      case "LIST_TABLE_DESIGNS":
        path = '/pos-dashboard/admin-table-details';
        break;
      case "LIST_RESTAURANT":
        path = '/pos-dashboard/admin-restaurant';
        break;
      case "LIST_TAX":
        path = '/pos-dashboard/masters-tax';
        break;
      case "LIST_MODIFIERS":
        path = '/pos-dashboard/masters-modifiers';
        break;
      case "LIST_DISCOUNT":
        path = '/pos-dashboard/masters-discount';
        break;
      case "LIST_PROMO_CODES":
        path = '/pos-dashboard/promo-code';
        break;
      case "LIST_ROLES_AND_PERMISSIONS":
        path = '/pos-dashboard/role';
        break;
      case "LIST_USER_REGISTRATION":
        path = '/pos-dashboard/master-user-registration';
        break;
      case "LIST_MENU":
        path = '/pos-dashboard/item-master';
        break;
      case "LIST_STOCK":
        path = '/pos-dashboard/Inventory';
        break;
      case "LIST_PRODUCT":
        path = '/pos-dashboard/Inventory/product';
        break;
      case "LIST_SUPPLIER":
        path = '/pos-dashboard/Inventory/supplier';
        break;
      case "LIST_SUPPLIER_ORDER":
        path = '/pos-dashboard/Inventory/supplier-order';
        break;
      case "LIST_BATCH_ITEM":
        path = '/pos-dashboard/Inventory/batch-item';
        break;
      case "LIST_DINE_IN":
        path = '/pos-dashboard/dine-in';
        break;
      case "LIST_ONLINE":
        path = '/pos-dashboard/online';
        break;
      case "LIST_TAKEAWAY":
        path = '/pos-dashboard/walk-in';
        break;
      case "LIST_KITCHEN":
        path = '/pos-dashboard/kitchen';
        break;
      case "LIST_BAR":
        path = '/pos-dashboard/warehouse';
        break;
      case "LIST_PRINT_DESIGNS":
        path = '/pos-dashboard/print';
        break;
      case "LIST_GENERAL_SETTINGS":
        path = '/pos-dashboard/general-settings';
        break;
      case "LIST_LOYALITY_SETTINGS":
        path = '/pos-dashboard/loyality-settings';
        break;
      case "LIST_SHIFT_TIMINGS":
        path = '/pos-dashboard/shifttiming';
        break;
      case "BY_CATEGORY":
        path = '/pos-dashboard/sales-by-category';
        break;
      case "BY_ITEM":
        path = '/pos-dashboard/sales-by-item';
        break;
      case "BY_ORDER":
        path = '/pos-dashboard/sales-by';
        break;
      case "VIEW_DASHBOARD_MODULE":
        path = '/pos-dashboard/dashboard';
        break;
      case "LIST_PETTYCASH":
        path = '/pos-dashboard/pettycash';
        break;
      case "LIST_PAYMENTMODE":
        path = '/pos-dashboard/paymentmode';
        break;
      case "DOWNLOAD_REPORT":
        path = '/pos-dashboard/pettycash';
        break;
      case "ADD_CASH":
        path = '/pos-dashboard/pettycash';
        break;
    }
    return path;
  }
  SetGeneralSetting(): void {
    const generalSettingStr = sessionStorage.getItem("GeneralSetting");
    if (generalSettingStr) {
      try {
        this.generalSettings = JSON.parse(generalSettingStr);
      } catch (error) {
        console.error('Error parsing GeneralSetting from sessionStorage:', error);
      }
    }
  }

  ResturantPermissionMaster: string[] = [
    "Dashboard",
    "PettyCash",
    "Stock",
    "Product",
    "Supplier",
    "Supplier Order",
    "Batch Item",
    "Dine In",
    "Online",
    "Takeaway",
    "Sales"
  ];

  //This method is used to check the side menu display permission.
  //If 1 side menu has multiple sub menus inside.
  checkMenuDisplayPermission(ModuleArray: string[]): boolean {
    //console.log("called menu disp")
    const modulesStr = sessionStorage.getItem("ModulesMaster");
    const userCredentialStr = sessionStorage.getItem('userCredential');
    
    if (!modulesStr || !userCredentialStr) {
      return false;
    }

    try {
      //If login user has Super Admin role, then bypass the roles&permissions check
      this.Modules = JSON.parse(modulesStr);
      const UserData: UserCredential = JSON.parse(userCredentialStr);
      
      if (UserData.roleName == 'Super Admin') {
        return true;
      } else {

        const ModuleIdArray: ModuleData[] = [];
        for (let i = 0; i < ModuleArray.length; i++) {
          const getModuleid = this.Modules.find((x: ModuleData) => x.moduleName == ModuleArray[i]);
          if (getModuleid) {
            ModuleIdArray.push(getModuleid);
          }
        }

        //If any 1 module id is present in user->permissions->moduleId. Then display the particular side menu
        for (let j = 0; j < ModuleIdArray.length; j++) {
          if (UserData?.permissions?.some((x: FeatureData) => x.moduleId == ModuleIdArray[j]?.moduleId)) {
            return true;
          }
        }
        return false;
      }
    } catch (error) {
      console.error('Error parsing sessionStorage data:', error);
      return false;
    }
  }

  NavigateUserBasedOnPermissions(isFromLogin: boolean, ModuleArray: string[]): string | void {
    const modulesStr = sessionStorage.getItem("ModulesMaster");
    const userCredentialStr = sessionStorage.getItem('userCredential');
    
    if (!modulesStr || !userCredentialStr) {
      return '';
    }

    try {
      this.Modules = JSON.parse(modulesStr);
      const UserData: UserCredential = JSON.parse(userCredentialStr);
      let path: string = '';
      
      if (isFromLogin) {
        //This block refers to navigate the routing on click of user login
        if (UserData.permissions) {
          for (let i = 0; i < UserData.permissions.length; i++) {
            path = this.callNavigationBlock(UserData.permissions[i].featureCode);
            if (path != "") {
              break;
            }
          }
        }
        return path;

      } else {
        //This block refers to navigate the routing on click of side menu
        const ModuleIdArray: ModuleData[] = [];
        for (let i = 0; i < ModuleArray.length; i++) {
          const getModuleid = this.Modules.find((x: ModuleData) => x.moduleName == ModuleArray[i]);
          if (getModuleid != undefined) {
            ModuleIdArray.push(getModuleid);
          }
        }
        
        /*Only for Orders page, start 03-06-2025
        Whenever user clicks the order menu, The first order type should be active*/
        const tempArray: ModuleData[] = [];
        const DineInObj = ModuleIdArray.find((x: ModuleData) => x.moduleName == 'Dine In');
        const OnlineObj = ModuleIdArray.find((x: ModuleData) => x.moduleName == 'Online');
        const TakeawayObj = ModuleIdArray.find((x: ModuleData) => x.moduleName == 'Takeaway');

        if (DineInObj) {
          tempArray.push(DineInObj);
          const index = ModuleIdArray.findIndex((x: ModuleData) => x.moduleId == DineInObj.moduleId);
          if (index !== -1) {
            ModuleIdArray.splice(index, 1);
          }
        } 
        if (OnlineObj) {
          tempArray.push(OnlineObj);
          const Onlineindex = ModuleIdArray.findIndex((x: ModuleData) => x.moduleId == OnlineObj.moduleId);
          if (Onlineindex !== -1) {
            ModuleIdArray.splice(Onlineindex, 1);
          }
        } 
        if (TakeawayObj) {
          tempArray.push(TakeawayObj);
          const Takeawayindex = ModuleIdArray.findIndex((x: ModuleData) => x.moduleId == TakeawayObj.moduleId);
          if (Takeawayindex !== -1) {
            ModuleIdArray.splice(Takeawayindex, 1);
          }
        }
        
        tempArray.forEach(element => {
          ModuleIdArray.push(element);
        });
        /*Only for Orders page, end 04-06-2025*/

        //If any 1 module id is present in user->permissions->moduleId. Then display the particular side menu
        for (let j = 0; j < ModuleIdArray.length; j++) {
          if (UserData.permissions?.some((x: FeatureData) => x.moduleId == ModuleIdArray[j]?.moduleId)) {

            //Navigate the user according to the permission routing
            const getFeatureCodeByModuleId = UserData.permissions.filter((x: FeatureData) => x.moduleId == ModuleIdArray[j].moduleId);
            for (let l = 0; l < getFeatureCodeByModuleId.length; l++) {
              path = this.callNavigationBlock(getFeatureCodeByModuleId[l].featureCode);
              if (path != "") {
                break;
              }
            }
          }
          if (path !== "") {
            break;
          }
        }
        this.router.navigate([path]);
      }
    } catch (error) {
      console.error('Error parsing sessionStorage data:', error);
      return '';
    }
  }

} 