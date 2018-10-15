import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";
import { AdminGuard } from "../auth/_guards/admin.guard";
import { CoachGuard } from "../auth/_guards/coach.guard";

const routes: Routes = [
    {
        "path": "",
        "component": ThemeComponent,
        "canActivate": [AuthGuard],
        "children": [
            {
                "path": "agency/setup",
                "loadChildren": ".\/pages\/default\/agency\/agency-setup\/agency-setup.module#AgencySetupModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "agency/edit/:id",
                "loadChildren": ".\/pages\/default\/agency\/agency-setup\/agency-setup.module#AgencySetupModule",
                "canActivate": [AdminGuard]

            },
            {
                "path": "agency\/list",
                "loadChildren": ".\/pages\/default\/agency\/agency-list\/agency-list.module#AgencyListModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "technology/setup",
                "loadChildren": ".\/pages\/default\/technology\/technology-setup\/technology-setup.module#TechnologySetupModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "technology/edit/:id",
                "loadChildren": ".\/pages\/default\/technology\/technology-setup\/technology-setup.module#TechnologySetupModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "coaching/assign/coacher/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-assign-coacher\/coaching-assign-coacher.module#CoachingAssignCoacherModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "coaching/valuation/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-valuation\/coaching-valuation.module#CoachingValuationModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "coaching/update/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-update\/coaching-update.module#CoachingUpdateModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "coaching/update2/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-update2\/coaching-update2.module#CoachingUpdate2Module",
                "canActivate": [AdminGuard]
            },
            {
                "path": "coaching/update-attendance/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-update-attendance\/coaching-update-attendance.module#CoachingUpdateAttendanceModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "coaching/actApprove/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-updateAct\/coaching-updateAct.module#CoachingUpdateActModule"
            },
            {
                "path": "coaching/view/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-view\/coaching-view.module#CoachingViewModule"
            },
            {
                "path": "coaching\/info\/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-view\/coaching-view-info.module#CoachingViewInfoModule"
            },
            {
                "path": "technology\/list",
                "loadChildren": ".\/pages\/default\/technology\/technology-list\/technology-list.module#TechnologyListModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "assesment\/user",
                "loadChildren": ".\/pages\/default\/assesment\/asses-user\/asses-user.module#AssesUserModule"
            },
            {
                "path": "assesment\/exam",
                "loadChildren": ".\/pages\/default\/assesment\/asses-user-exam\/asses-user-exam.module#AssesUserExamModule"
            },
            {
                "path": "assesment\/list",
                "loadChildren": ".\/pages\/default\/assesment\/asses-list\/asses-list.module#AssesListModule"
            },
            {
                "path": "assesment\/list\/setup",
                "loadChildren": ".\/pages\/default\/assesment\/asses-que-list\/asses-que-list.module#AssesQueListModule"
            }
            ,
            {
                "path": "assesment\/list\/edit\/:id",
                "loadChildren": ".\/pages\/default\/assesment\/asses-que-list\/asses-que-list.module#AssesQueListModule"
            },
            {
                "path": "assesment\/que\/setup",
                "loadChildren": ".\/pages\/default\/assesment\/asses-setup\/asses-setup.module#AssesSetupModule"
            },
            {
                "path": "index",
                "loadChildren": ".\/pages\/default\/index\/index.module#IndexModule"
            },
            {
                "path": "indexUser",
                "loadChildren": ".\/pages\/default\/index\/index-user\/index-user.module#IndexUserModule"
            },
            {
                "path": "header\/actions",
                "loadChildren": ".\/pages\/default\/header\/header-actions\/header-actions.module#HeaderActionsModule"
            },
            {
                "path": "header\/profile",
                "loadChildren": ".\/pages\/default\/header\/header-profile\/header-profile.module#HeaderProfileModule"
            },
            {
                "path": "header/profile/view/:id",
                "loadChildren": ".\/pages\/default\/header\/header-profile-view\/header-profile-view.module#HeaderProfileViewModule"
            },
            {
                "path": "404",
                "loadChildren": ".\/pages\/default\/not-found\/not-found\/not-found.module#NotFoundModule"
            },
            {
                "path": "",
                "redirectTo": "index",
                "pathMatch": "full"
            },
            {
                "path": "coaching\/register",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-register\/coaching-register.module#CoachingRegisterModule"
            },
            {
                "path": "coaching/edit/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-edit\/coaching-edit.module#CoachingEditModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training\/laporan",
                "loadChildren": ".\/pages\/default\/training\/training-laporan\/training-laporan.module#TrainingLaporanModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training/laporan/kehadiran/:id",
                "loadChildren": ".\/pages\/default\/training\/training-laporan-kehadiran\/training-laporan-kehadiran.module#TrainingLaporanKehadiranModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training\/register",
                "loadChildren": ".\/pages\/default\/training\/training-register\/training-register.module#TrainingRegisterModule"
            },
            {
                "path": "cap\/register",
                "loadChildren": ".\/pages\/default\/capability\/cap-register\/cap-register.module#CapabilityRegisterModule"
            },
            {
                "path": "training/details/:id",
                "loadChildren": ".\/pages\/default\/training\/training-details\/training-details.module#TrainingDetailsModule"
            },
            {
                "path": "training/details/view/:id",
                "loadChildren": ".\/pages\/default\/training\/training-details-2\/training-details-2.module#TrainingDetails2Module"
            },
            {
                "path": "training/info/:id",
                "loadChildren": ".\/pages\/default\/training\/training-details-2\/training-details-info.module#TrainingDetailsInfoModule"
            },
            {
                "path": "setting/cap",
                "loadChildren": ".\/pages\/default\/setting\/setting-cap\/setting-cap.module#SettingCapModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "cap/edit/:id",
                "loadChildren": ".\/pages\/default\/setting\/setting-cap\/setting-cap.module#SettingCapModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training/setting",
                "loadChildren": ".\/pages\/default\/training\/training-setting\/training-setting.module#TrainingSettingModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training/edit/:id",
                "loadChildren": ".\/pages\/default\/training\/training-setting\/training-setting.module#TrainingSettingModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training/valuation/:id",
                "loadChildren": ".\/pages\/default\/training\/training-valuation\/training-valuation.module#TrainingValuationModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "training/valuation/view/:id",
                "loadChildren": ".\/pages\/default\/training\/training-valuation-2\/training-valuation-2.module#TrainingValuation2Module",
                "canActivate": [CoachGuard]
            },
            {
                "path": "setting-infra/setting/:id",
                "loadChildren": ".\/pages\/default\/setting\/setting-infra\/setting-infra.module#SettingInfraModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "infra/view/:id",
                "loadChildren": ".\/pages\/default\/infra-management\/infra-view\/infra-view.module#InfraViewModule"
            },
            {
                "path": "training/approval/:id",
                "loadChildren": ".\/pages\/default\/training\/training-approval\/training-approval.module#TrainingApprovalModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training/approval/view/:id",
                "loadChildren": ".\/pages\/default\/training\/training-approval-2\/training-approval-2.module#TrainingApproval2Module",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training/attendance/confirmation/:id",
                "loadChildren": ".\/pages\/default\/training\/training-attendance-confirmation\/training-attendance-confirmation.module#TrainingAttendanceConfirmationModule"
            },
            {
                "path": "training/peserta/:id",
                "loadChildren": ".\/pages\/default\/training\/trainingLs-peserta\/trainingLs-peserta.module#TrainingLsPesertaModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "cap/peserta/:id",
                "loadChildren": ".\/pages\/default\/capability\/cap-peserta\/cap-peserta.module#CapabilityPesertaModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "training/current/attendance/:id",
                "loadChildren": ".\/pages\/default\/training\/training-current-attendance\/training-current-attendance.module#TrainingCurrentAttendanceModule"
            },
            {
                "path": "training/coachAttendance/:id",
                "loadChildren": ".\/pages\/default\/training\/training-coachAttendance\/training-coachAttendance.module#TrainingCoachAttendanceModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "coaching/approval/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-approval\/coaching-approval.module#CoachingApprovalModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "coaching/attendance/:id",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-attendance\/coaching-attendance.module#CoachingAttendanceModule"
            },
            {
                "path": "coaching\/list",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-list\/coaching-list.module#CoachingListModule"
            },
            {
                "path": "coaching\/completion",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-completion\/coaching-completion.module#CoachingCompletionModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "coaching\/laporan",
                "loadChildren": ".\/pages\/default\/report\/coaching-laporan\/coaching-laporan.module#CoachingLaporanModule"
            },
            {
                "path": "coaching/laporan/kehadiran/:id",
                "loadChildren": ".\/pages\/default\/report\/coaching-laporan\/coaching-report.module#CoachingReportModule"
            },
            {
                "path": "cap\/laporan",
                "loadChildren": ".\/pages\/default\/report\/cap-laporan\/cap-laporan.module#CapLaporanModule"
            },
            {
                "path": "cap/laporan/kehadiran/:id",
                "loadChildren": ".\/pages\/default\/report\/cap-laporan\/cap-report.module#CapReportModule"
            },
            {
                "path": "infra\/list",
                "loadChildren": ".\/pages\/default\/infra-management\/infra-m-list\/infra-m-list.module#InfraMListModule"
            },
            {
                "path": "coaching\/list\/coach",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-ls-coach\/coaching-ls-coach.module#CoachingLsCoachModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "coaching\/list\/admin",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-ls-admin\/coaching-ls-admin.module#CoachingLsAdminModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "coaching\/list\/supervisor",
                "loadChildren": ".\/pages\/default\/coaching\/coaching-ls-supervisor\/coaching-ls-supervisor.module#CoachingLsSupervisorModule"
            },
            {
                "path": "training\/list",
                "loadChildren": ".\/pages\/default\/training\/training-list\/training-list.module#TrainingListModule"
            },
            {
                "path": "training\/listing",
                "loadChildren": ".\/pages\/default\/training\/training-listing\/training-listing.module#TrainingListingModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "capability\/listing",
                "loadChildren": ".\/pages\/default\/capability\/cap-listing\/cap-listing.module#CapListingModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training\/list\/coach",
                "loadChildren": ".\/pages\/default\/training\/trainingList-coach\/trainingListCoach.module#TrainingListCoachModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "training\/admin",
                "loadChildren": ".\/pages\/default\/training\/training-admin\/training-admin.module#TrainingAdminModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "training\/list\/admin\/:id",
                "loadChildren": ".\/pages\/default\/training\/trainingList-admin\/trainingList-admin.module#TrainingListAdminModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "cap\/list\/admin",
                "loadChildren": ".\/pages\/default\/capability\/cap-list-admin\/cap-list-admin.module#CapListAdminModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "user\/edit\/:id",
                "loadChildren": ".\/pages\/default\/user-management\/user-detail\/user-detail.module#UserDetailModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "user-management\/list",
                "loadChildren": ".\/pages\/default\/user-management\/user-m-list\/user-m-list.module#UserMListModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "user\/application",
                "loadChildren": ".\/pages\/default\/user-management\/user-m-list-application\/user-m-list-application.module#UserMListApplicationModule"
            },
            {
                "path": "role\/application",
                "loadChildren": ".\/pages\/default\/role\/role-application\/role-application.module#RoleApplicationModule"
            },
            {
                "path": "role\/application\/approval\/:id",
                "loadChildren": ".\/pages\/default\/role\/role-application-approval\/role-application-approval.module#RoleApplicationApprovalModule"

            },
            {
                "path": "role\/approval",
                "loadChildren": ".\/pages\/default\/role\/role-approval-list\/role-approval-list.module#RoleApprovalListModule"
            },
            {
                "path": "role\/setting",
                "loadChildren": ".\/pages\/default\/role\/role-setting\/role-setting.module#RoleSettingModule"
            },
            {
                "path": "role",
                "loadChildren": ".\/pages\/default\/role\/role-list\/role-list.module#RoleListModule"
            },
            {
                "path": "cert\/register",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-register\/cert-register.module#CertRegisterModule"
            },
            {
                "path": "cert/details/:id",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-details\/cert-details.module#CertDetailsModule"
            },
            {
                "path": "cert/details/view/:id",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-details-2\/cert-details-2.module#CertDetails2Module"
            },
            {
                "path": "cert\/setting",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-setting\/cert-setting.module#CertSettingModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "certification/edit/:id",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-setting\/cert-setting.module#CertSettingModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "cert/peserta/:id",
                "loadChildren": ".\/pages\/default\/certificate-training\/certLs-peserta\/certLs-peserta.module#CertLsPesertaModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "cert/valuation/:id",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-valuation\/cert-valuation.module#CertValuationModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "cert/approval/:id",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-approval\/cert-approval.module#CertApprovalModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "cert/approval/view/:id",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-approval-2\/cert-approval-2.module#CertApproval2Module",
                "canActivate": [AdminGuard]
            },
            {
                "path": "cert/preattendance/:id",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-preAttendance\/cert-preattendance.module#CertPreattendanceModule"
            },
            {
                "path": "cert\/attendance",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-attendance\/cert-attendance.module#CertAttendanceModule"
            },
            {
                "path": "cert\/attendance/:id",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-attendance\/cert-attendance.module#CertAttendanceModule"
            },
            {
                "path": "persijilan\/laporan",
                "loadChildren": ".\/pages\/default\/report\/persijilan-laporan\/persijilan-laporan.module#PersijilanLaporanModule"
            },
            {
                "path": "cap/valuation/:id",
                "loadChildren": ".\/pages\/default\/capability\/cap-valuation\/cap-valuation.module#CapValuationModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "cap/application/:id",
                "loadChildren": ".\/pages\/default\/capability\/cap-application\/cap-application.module#CapApplicationModule"
            },
            {
                "path": "cap/view/:id",
                "loadChildren": ".\/pages\/default\/capability\/cap-view\/cap-view.module#CapViewModule"
            },
            {
                "path": "cap/info/:id",
                "loadChildren": ".\/pages\/default\/capability\/cap-view\/cap-info.module#CapInfoModule"
            },
            {
                "path": "cap\/list",
                "loadChildren": ".\/pages\/default\/capability\/cap-list\/cap-list.module#CapListModule"
            },
            {
                "path": "cap\/list\/coach",
                "loadChildren": ".\/pages\/default\/capability\/cap-list-coach\/cap-list-coach.module#CapListCoachModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "cap/approval/:id",
                "loadChildren": ".\/pages\/default\/capability\/cap-approval\/cap-approval.module#CapApprovalModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "cap/attendance/:id",
                "loadChildren": ".\/pages\/default\/capability\/cap-attendance\/cap-attendance.module#CapAttendanceModule"
            },
            {
                "path": "cap/coachAttendance/:id",
                "loadChildren": ".\/pages\/default\/capability\/cap-coachAttendance\/cap-coachAttendance.module#CapCoachAttendanceModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "cap/update/act/:id",
                "loadChildren": ".\/pages\/default\/capability\/cap-update-act\/cap-update-act.module#CapUpdateActModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "feedback\/setup\/:id",
                "loadChildren": ".\/pages\/default\/feedback\/fb-setup\/fb-setup.module#FbSetupModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "feedback\/list",
                "loadChildren": ".\/pages\/default\/feedback\/fb-list\/fb-list.module#FbListModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "coaching\/feedback\/:id",
                "loadChildren": ".\/pages\/default\/feedback\/coaching\/fb-coaching\/fb-coaching.module#FBCoachingModule"
            },
            {
                "path": "coaching\/feedback\/action\/:userid\/:instanceid",
                "loadChildren": ".\/pages\/default\/feedback\/coaching\/fb-coaching-action\/fb-coaching-action.module#FBCoachingActionModule"
            },
            {
                "path": "coaching\/feedback\/ro\/:userid\/:instanceid",
                "loadChildren": ".\/pages\/default\/feedback\/coaching\/fb-coaching-RO\/fb-coaching-RO.module#FBCoachingROModule"
            },
            {
                "path": "cap\/feedback\/:id",
                "loadChildren": ".\/pages\/default\/feedback\/capab\/fb-capab\/fb-capab.module#FBCapabModule"
            },
            {
                "path": "cap\/feedback\/action\/:userid\/:instanceid",
                "loadChildren": ".\/pages\/default\/feedback\/capab\/fb-capab-action\/fb-capab-action.module#FBCapabActionModule"
            },
            {
                "path": "cap\/feedback\/ro\/:userid\/:instanceid",
                "loadChildren": ".\/pages\/default\/feedback\/capab\/fb-capab-RO\/fb-capab-RO.module#FBCapabROModule"
            },
            {
                "path": "training\/feedback\/action\/:userid\/:instanceid",
                "loadChildren": ".\/pages\/default\/feedback\/training\/fb-training-action\/fb-training-action.module#FBTrainingActionModule"
            },
            {
                "path": "training\/feedback\/:id",
                "loadChildren": ".\/pages\/default\/feedback\/training\/fb-training\/fb-training.module#FBTrainingModule"
            },
            {
                "path": "training\/feedback\/ro\/:userid\/:instanceid",
                "loadChildren": ".\/pages\/default\/feedback\/training\/fb-training-RO\/fb-training-RO.module#FBTrainingROModule"
            },
            {
                "path": "infra-management\/application",
                "loadChildren": ".\/pages\/default\/infra-management\/infra-m-application\/infra-m-application.module#InfraMApplicationModule"
            },
            {
                "path": "infra-management/application/:id",
                "loadChildren": ".\/pages\/default\/infra-management\/infra-m-application\/infra-m-application.module#InfraMApplicationModule"
            },
            {
                "path": "infra-management\/approval",
                "loadChildren": ".\/pages\/default\/infra-management\/infra-m-approval\/infra-m-approval.module#InfraMApprovalModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "cert\/list",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-list\/cert-list.module#CertListModule"
            },
            {
                "path": "cert\/listing",
                "loadChildren": ".\/pages\/default\/certificate-training\/cert-listing\/cert-listing.module#CertificationListingModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "cert\/list\/coach",
                "loadChildren": ".\/pages\/default\/certificate-training\/certLs-coach\/certLs-coach.module#CertListCoachModule",
                "canActivate": [CoachGuard]
            },
            {
                "path": "cert\/list\/admin",
                "loadChildren": ".\/pages\/default\/certificate-training\/certLs-admin\/certLs-Admin.module#CertListAdminModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "setting-schema\/setting",
                "loadChildren": ".\/pages\/default\/setting\/setting-schema\/setting-schema.module#SettingSchemaModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "schema-list\/list",
                "loadChildren": ".\/pages\/default\/setting\/setting-schema-list\/schema-list.module#SchemaListModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "setting-schema/edit/:id",
                "loadChildren": ".\/pages\/default\/setting\/setting-schema\/setting-schema.module#SettingSchemaModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "setting-agency\/setting",
                "loadChildren": ".\/pages\/default\/setting\/setting-agency\/setting-agency.module#SettingAgencyModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "setting-grade\/setting",
                "loadChildren": ".\/pages\/default\/setting\/setting-grade\/setting-grade.module#SettingGradeModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "grade-list\/list",
                "loadChildren": ".\/pages\/default\/setting\/setting-grade-list\/grade-list.module#GradeListModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "setting-grade/edit/:id",
                "loadChildren": ".\/pages\/default\/setting\/setting-grade\/setting-grade.module#SettingGradeModule",
                "canActivate": [AdminGuard]
            },
            {
                "path": "setting-manday\/setting",
                "loadChildren": ".\/pages\/default\/setting\/setting-manday\/setting-manday.module#SettingMandayModule",
                "canActivate": [AdminGuard]
            },

        ]
    },
    // {
    //     "path": "snippets\/pages\/user\/login-1",
    //     "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/user\/user-login-1\/user-login-1.module#UserLogin1Module"
    // },
    {
        "path": "error\/403",
        "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/errors\/errors-error-6\/errors-error-6.module#ErrorsError6Module"
    },
    {
        "path": "**",
        "redirectTo": "404",
        "pathMatch": "full"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThemeRoutingModule { }
