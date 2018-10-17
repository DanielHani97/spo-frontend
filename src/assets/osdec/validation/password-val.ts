import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {

        let new_password = AC.get('new_password').value; // to get value in input tag

        let confirm_password = AC.get('confirm_password').value;
        // to get value in input tag

        if (new_password != confirm_password) {

            console.log('false');
            AC.get('confirm_password').setErrors({ MatchPassword: true })

        } else {

            AC.get('confirm_password').setErrors({ MatchPassword: false })
            console.log('true');
            return null
        }
    }
}
