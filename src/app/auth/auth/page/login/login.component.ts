import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// Removed ng-bootstrap imports due to compatibility issues
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as CryptoJS from 'crypto-js';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// Services
import { AlertService } from '../../../../Common/alert.service';
import { CommonService } from '../../../../Common/common.service';
import { PosDataService } from 'src/app/Common/pos-data.service';
import { PosAuthService } from 'src/app/Common/pos-auth.service';

// Components - temporarily removed due to ng-bootstrap issues
 import { ForgetComponent } from '../forget/forget.component';
import { AddItemService } from 'src/app/Common/add-item.service';

// Note: You'll need to create these services or import them from your existing codebase

// import { PosAuthService } from '../services/pos-auth.service';
// import { PosSharedService } from '../services/pos-shared.service';
// import { AddItemService } from '../services/add-item.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm!: FormGroup;
  loginData: any;
  submitted: boolean = false;
  returnUrl: any;
  userData: any;
  closeResult: string = '';
  resData: any[] = [];
  MultiRestaurant: any;
  showpassword: boolean = false;
  passIcon: boolean = false;
  loginError: string = "";
  ResturantSelection: boolean = false;
  restaurantUserLink: any;
  resId: string = '';
  validationNoOutletsForSelectedResturant: boolean = false;
  resDataByID: any;
  validateResturantSelection: boolean = false;
  login: boolean = false;
  Modules: any;
  forgetModalRef: NgbModalRef | null = null;

  constructor(
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private posDataService: PosDataService,
    private posAuthService: PosAuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
     private modalService: NgbModal,
    
    // private posSharedService: PosSharedService,
    public commonService: CommonService,
     private itemService : AddItemService
  ) { }

  get loginForm() { return this.LoginForm.controls; }

  ngOnInit() {
    this.ResturantSelection = false;
    sessionStorage.clear();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home'
    this.LoginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      restaurantId: ['']
    });
  }

  public onLogin() {
    debugger
    this.loginError = '';
    this.submitted = true;
    if (this.LoginForm.invalid) {
      this.alertService.showWarning("Field is Empty");
    } else {
      const secretKey = 'qwertyuiop77893408sdsdfd'; 
      const encrypted = CryptoJS.AES.encrypt(this.LoginForm.value.password, secretKey).toString();
      sessionStorage.setItem('Password', encrypted);
      this.posAuthService.userCredential(this.LoginForm.value).subscribe((res: any) => {
        let msg = res['message'];
        let success = res['success'];
        let data = res['data'];
        if (success) {
          this.login = success;

          this.alertService.showSuccess('Login Successfully!!!');
          if (data.roleName == "Super Admin") {
            sessionStorage.setItem('userCredential', JSON.stringify(data));
            sessionStorage.setItem('Role', data.roleName);
            sessionStorage.setItem('token', data.token);
            this.restaurantUserLink = [];
            this.getAllRestaurantData();
          } else {
            this.posAuthService.userResDataByUserId(data.userId).subscribe((res: any) => {
              let Resdata = res['data'];
              this.restaurantUserLink = Resdata;
              sessionStorage.setItem('restaurantData', JSON.stringify(Resdata));
              sessionStorage.setItem('userCredential', JSON.stringify(data));
              sessionStorage.setItem('Role', data.roleName);
              sessionStorage.setItem('token', data.token);
              this.getAllRestaurantData();
            });
          }
          this.validateResturantSelection = false;
        } else {

          this.loginError = msg;

          this.alertService.showError("Login failed!!, email or password is incorrect");
        }
      });
    }
  }


  forgotPassword() {
    this.forgetModalRef = this.modalService.open(ForgetComponent, { backdrop: 'static', windowClass: 'main_add_popup', keyboard: true, centered: true });
    this.forgetModalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.forgetModalRef = null;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.forgetModalRef = null;
    });
  }

  closeForgetModal() {
    if (this.forgetModalRef) {
      this.forgetModalRef.close('Closed from LoginComponent!');
      this.forgetModalRef = null;
    }
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  enablePass(event: any) {
    if (event.target.value) {
      this.passIcon = true;
    } else {
      this.passIcon = false;
    }
  }

  show_password() {
    this.showpassword = !this.showpassword;
  }

 getAllRestaurantData() {
    this.resData = [];
    this.ngxLoader.startLoader('loader-01');
    this.posDataService.getAllRestaurants(false).subscribe((res: any) => {
      this.ngxLoader.stopLoader('loader-01');
      let data = res['data'];
      let success = res['success'];
      let msg = res['message'];
      if (success) {
        if (sessionStorage.getItem('Role') != 'Super Admin') {
          const restaurantDataString = sessionStorage.getItem('restaurantData');
          this.MultiRestaurant = restaurantDataString ? JSON.parse(restaurantDataString) : [];
          this.MultiRestaurant.forEach((element: any) => {
            const resD = data.find((x: any) => x.restaurantId == element.restaurantId);
            if (resD != null && resD != undefined)
              this.resData?.push(resD);
          });
        }
        else {
          this.resData = data;
        }
        sessionStorage.setItem('restaurants', JSON.stringify(this.resData));
        this.ResturantSelection = true;
      } else {
        this.alertService.showError(msg);
      }
    });
  }

  OnClickLogout() {
    sessionStorage.clear();
    localStorage.removeItem('authToken');
    this.login = false;
    this.ResturantSelection = false;
    this.loginForm['restaurantId'].setValue("");
  }

  onSelectRestaurant(): void {
    debugger
    const selectedRestaurant = this.LoginForm.get('restaurantId')?.value;
    if (selectedRestaurant) {
      console.log('Selected restaurant details:', selectedRestaurant);
      // Use the selectedRestaurant object as needed
      this.resId = selectedRestaurant.restaurantId;
      this.getRestaurantDataById();
    }
  }

  getRestaurantDataById() {
    this.ngxLoader.startLoader('loader-01');
    this.validationNoOutletsForSelectedResturant = false;
    this.posDataService.getRestaurantById(this.resId).subscribe((res: any) => {
      this.ngxLoader.stopLoader('loader-01');
      this.resDataByID = res['data'];
      let success = res['success'];
      let msg = res['message'];
      if (success) {
        sessionStorage.setItem('activeRestaurant', JSON.stringify(res['data']));
        let outlets: any[] = [];
        this.FilterOutlets(outlets);
      } else {
        this.alertService.showError(msg);
        this.validationNoOutletsForSelectedResturant = true;
      }
    });
  }

  private FilterOutlets(outlets: any[]) {
    if (this.restaurantUserLink !== null && this.restaurantUserLink !== undefined && this.restaurantUserLink && this.restaurantUserLink?.length > 0) {
      let userOutlets = this.restaurantUserLink.find((x: any) => x.restaurantId == this.resId).outlets;
      this.LoopAndRemoveOutlet(userOutlets, outlets);
    }
    if (outlets != null && outlets != undefined && outlets.length > 0)
      this.resDataByID.outlets = outlets;
    sessionStorage.setItem('RestaurantFeatures', JSON.stringify(this.resDataByID.permission));
    if (this.resDataByID.outlets && this.resDataByID.outlets.length > 0) {
      sessionStorage.setItem('ResturantByID', JSON.stringify(this.resDataByID));

      let outletId = this.resDataByID.outlets[0].outletId;
      let outlet = this.resDataByID.outlets[0];
      sessionStorage.setItem('activeOutlet', JSON.stringify(outlet));
      sessionStorage.setItem('activeOutletId', outletId);
      sessionStorage.setItem('activeOutletname', this.resDataByID.outlets[0].outletName);
      sessionStorage.setItem('activeRestaurantId', this.resId);
      // this.posSharedService.onSelectNotify(outletId);
    } else {
      this.validationNoOutletsForSelectedResturant = true;
    }
  }

  private LoopAndRemoveOutlet(userOutlets: any[], outlets: any[]): void {
    userOutlets.forEach((element: any) => {
      if (element !== undefined && element !== null && element !== '') {
        const foundOutlet = this.resDataByID.outlets.find((x: any) => x.outletId === element);
        if (foundOutlet) {
          outlets.push(foundOutlet);
        }
      }
    });
  }

  Reset() {
    window.location.reload();
  }

  onContinue() {
    const restaurantIdControl = this.LoginForm.get('restaurantId');
    if (!restaurantIdControl || restaurantIdControl.value == '' || !restaurantIdControl.value) {
      this.validateResturantSelection = true;
      return;
    }
    if (this.validationNoOutletsForSelectedResturant) {
      return;
    }
    let restaurantId = restaurantIdControl.value;
    sessionStorage.setItem('activeRestaurantId', restaurantId);
    sessionStorage.setItem('validationNoOutletsForSelectedResturant', String(this.validationNoOutletsForSelectedResturant));

    this.getAllModulesList();
    setTimeout(() => {      
      const userCredentialStr = sessionStorage.getItem('userCredential');
      if (userCredentialStr) {
        let userData = JSON.parse(userCredentialStr);
        this.getGeneralSettingsByOutlet();
        //If login user has Super Admin role, then bypass the roles&permissions check
        if (userData.roleName == 'Super Admin') {
          this.router.navigate(['/pos-dashboard/dine-in']);
        } else {
          let path = this.commonService.NavigateUserBasedOnPermissions(true, []);
          this.router.navigate([path]);
        }
      }
    }, 1000);
  }

  getGeneralSettingsByOutlet() {
    this.itemService.getGeneralSettingsByOutletID(sessionStorage.getItem("activeOutletId")).subscribe((res: any) => {
      if (res.success == true) {
        this.ngxLoader.stopLoader('loader-01');
        sessionStorage.setItem("GeneralSetting",JSON.stringify(res.data))
        this.commonService.SetGeneralSetting();
      }
      else {
        this.ngxLoader.stopLoader('loader-01');
      }
    });
  }

  getAllModulesList() {
    this.ngxLoader.startLoader('loader-01');
    this.posDataService.getAllModules().subscribe((res: any) => {
      this.ngxLoader.stopLoader('loader-01');
      this.Modules = res['data'];
      for (let i = 0; i < this.Modules.length; i++) {
        this.Modules[i].isChecked = false;
      }
      console.log("Modules", this.Modules);
      sessionStorage.setItem("ModulesMaster",JSON.stringify(this.Modules));
      let success = res['success'];
      let msg = res['message'];
      if (!success) {
        this.alertService.showError(msg);
      }
    });
  }
}
