import FieldTypes from "../Enums/FiedTypes";
import UserRoles from "../Enums/UserRoles";
import IField from "../Intefaces/IField";
import AdminAPI from "../APIs/AdminAPI";
import JobType from "../Enums/JobType";
import WorkMode from "../Enums/WorkMode";
import MainAPI from "../APIs/MainAPI";

// export const choiceData = {
//     localRoles: [
//         {
//             value: UserRoles.Admin,
//             label: "Administrator",
//             color: "green",
//             bgColor: "rgba(0, 128, 0, 0.298)",
//         },
//         {
//             value: UserRoles.Member,
//             label: "Member",
//             color: "#694F8E",
//             bgColor: "#E2C2EDFF",
//         },
//         {
//             value: UserRoles.Creator,
//             label: "Creater",
//             color: "orange",
//             bgColor: "rgba(255, 166, 0, 0.298)",
//         },
//     ],
//     localWorkMode: [
//         {
//             value: WorkMode.OnSite,
//             label: "On-Site",
//             color: "brown",
//             bgColor: "rgba(165, 42, 42, 0.3)",
//         },
//         {
//             value: WorkMode.Remote,
//             label: "Remote",
//             color: "skyblue",
//             bgColor: "rgba(135, 207, 235, 0.3)",
//         },
//         {
//             value: WorkMode.Hybrid,
//             label: "Hybrid",
//             color: "#ff8fa2",
//             bgColor: "rgba(255, 143, 162, 0.3)",
//         },
//     ],
//     localJobType: [
//         {
//             value: JobType.FulTime,
//             label: "Full Time",
//             color: "#fd0270",
//             bgColor: "rgba(253, 2, 111, 0.3)",
//         },
//         {
//             value: JobType.Partime,
//             label: "Partime",
//             color: "#02FD8F",
//             bgColor: "rgba(2, 253, 144, 0.3)",
//         },
//         {
//             value: JobType.PerShift,
//             label: "Per Shift",
//             color: "#fdac02",
//             bgColor: "rgba(253, 173, 2, 0.3)",
//         },
//         {
//             value: JobType.Freelance,
//             label: "Freelance",
//             color: "#0253FD",
//             bgColor: "rgba(2, 81, 253, 0.3)",
//         },
//         {
//             value: JobType.Internship,
//             label: "Internship",
//             color: "#0253FD",
//             bgColor: "rgba(2, 81, 253, 0.3)",
//         },
//         {
//             value: JobType.Volunteer,
//             label: "Volunteer",
//             color: "#0253FD",
//             bgColor: "rgba(2, 81, 253, 0.3)",
//         },
//     ],
//     localStatus: [
//         {
//             value: true,
//             label: "Active",
//             color: "green",
//             bgColor: "rgba(0, 128, 0, 0.298)",
//         },
//         { value: false, label: "Inactive", color: "#FF1515FF", bgColor: "#FF10106E" },
//     ],
//     draftStatus: [
//         {
//             value: true,
//             label: "Published",
//             color: "green",
//             bgColor: "rgba(0, 128, 0, 0.298)",
//         },
//         { value: false, label: "Draft", color: "#FF1515FF", bgColor: "#FF10106E" },
//     ],
//     publishState: [
//         {
//             value: true,
//             label: "Published",
//             color: "green",
//             bgColor: "rgba(0, 128, 0, 0.298)",
//         },
//         {
//             value: false,
//             label: "Not Published",
//             color: "#FF1515FF",
//             bgColor: "#FF10106E",
//         },
//     ],
//     localTrueFalse: [
//         { value: true, label: "True" },
//         { value: false, label: "False" },
//     ]
// };

const uploadImage = async (
	token: string,
	table: string,
	attachment: { file: any; name: string },
    record_id: string
): Promise<any> => {
	try {
		let response = await MainAPI.addAttachment(token, table, record_id, attachment);
		// let response = await AdminAPI.uploadImage(attachment.file);
		return response;
	} catch (error) {
		return 0;
	}
};

export const mapSingle = (fields: IField[], mappings: any, data: any) => {
	let new_fields: IField[] = fields.map((fld) => {
		let mpfunc = mappings[`${fld.id}`];
		if (mpfunc) {
			return {
				...fld,
				...mpfunc(data),
			};
		} else {
			return fld;
		}
	});

	return new_fields;
};

export const mapValue = async (fields: IField[], token?: string, table?: string) => {
	let new_instance: any = {};

	// fields.forEach(async (single_field) => {
	let single_field;
	let charToCheck = /<(s|S)(c|C)(r|R)(i|I)(p|P)(t|T)((\s)+(.|\n)*|(\s)*)>(.|\n)*<\/(s|S)(c|C)(r|R)(i|I)(p|P)(t|T)>/g;

	for (let i = 0; i < fields.length; i++) {
		single_field = fields[i];
		if (single_field.value == "" || single_field.value == null ||
            ((single_field.type == FieldTypes.NUMBER) && Number.isNaN(single_field.value))
		) {
			if (single_field.required) {
				throw new Error(`The field ${single_field.label} is required!`);
			}
		} else {
			if (charToCheck.test(`${single_field.value}`)) {
                throw new Error(`field ${single_field.label} should not contain scripting!`);
			}

			if ([FieldTypes.NUMBER, FieldTypes.FLOAT, FieldTypes.DOUBLE].includes(single_field.type)) {
				new_instance[single_field.id] = Number.isInteger(single_field.value)
					? parseInt(single_field.value)
					: parseFloat(single_field.value);
            } else if (single_field.type == FieldTypes.BOOLEAN) {
				new_instance[single_field.id] = ((single_field.value == "true") ? true : false);
			} else if (single_field.type == FieldTypes.DATE || single_field.type == FieldTypes.DATETIME) {
				new_instance[single_field.id] = new Date(single_field.value).toISOString();
			} else if (single_field.type == FieldTypes.IMAGE) {
				if (typeof single_field.value != "string") {
					new_instance[single_field.id] = await uploadImage(
						token ?? "user",
						table ?? "user",
						{
							file: single_field.value.files[0],
							name: "image from input",
						},
                        "0"
					);
				} else {
					new_instance[single_field.id] = single_field.value;
				}
			} else {
				new_instance[single_field.id] = single_field.value;
			}
		}
	}

	return new_instance;
};