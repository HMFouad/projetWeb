import {AbstractControl} from '@angular/forms';

export function MinDateValidator (otherFormControl: AbstractControl = null) {
    return (control: AbstractControl) => {
        const minDate = otherFormControl === null ?
            new Date () :
            new Date (otherFormControl.value);

        let ret;
        const currentDate = new Date(control.value).getTime();

        if (isNaN(currentDate)) {
            ret = { date: true };
        }
        else {
            if (isNaN(minDate.getTime())) {
                ret = null;
            }
            else {
                ret = (minDate.getTime() < currentDate) ?
                    null :
                    { minDate: true };
            }
        }

        return ret;
    };
}
