export default {

    nameRules: [v => !!v || "Name is required"],
    addressRules: [v => !!v || "Address is required"],
    emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    emergencyContactNoRules: [
        v => !!v || "Contact number is required",
        v =>
            /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})/.test(v) ||
            "Invalid contact number format"
    ],
    dateRules: [
        v => !!v || "Date is required"
    ],
    timeRules: [
        v => !!v || "Time is required"
    ],
    peopleRules: [
        v => !!v || "You must provide total number of people",
        v => /^\d+(,\d{1,2})?$/.test(v) || "Must be an integer number"
    ],
    fieldMandatoryRules: [v => !!v || "Time is required"],

    requiredNumberRules: [
        v => !!v || "This field is required",
        v => /^\d+(,\d{1,2})?$/.test(v) || "Must be an integer number"
    ],
    notRequiredNumberRules: (v) => {
        if (!v) return true
        if (v && v.length == 0) return true;
        if (/^\d+(,\d{1,2})?$/.test(v) == false) return "Must be an integer number"

        return true;

    },
    requiredFieldRule: [v => !!v || "This field is required"]
}