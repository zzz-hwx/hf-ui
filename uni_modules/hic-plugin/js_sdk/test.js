
/**
 * 验证十进制数字
 */
function number(value) {
    return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
}

/**
 * 是否数组
 */
function array(value) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value)
    }
    return Object.prototype.toString.call(value) === '[object Array]'
}

export function idCard(num) {
	let factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
	let varArray = new Array();
	let lngProduct = 0;
	let intCheckDigit;
	let intStrLen = num.length;
	let idNumber = num;
	if ((intStrLen != 15) && (intStrLen != 18)) {
		return false;
	}
	// check and set value
	for (let i = 0; i < intStrLen; i++) {
		varArray[i] = idNumber.charAt(i);
		if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
			return false;
		} else if (i < 17) {
			varArray[i] = varArray[i] * factorArr[i];
		}
	}
	if (intStrLen == 18) {
		// check date
		let date8 = idNumber.substring(6, 14);
		if (isDate8(date8) == false) {
			// error = "身份证中日期信息不正确！.";
			// alert(error);
			return false;
		}
		// calculate the sum of the products
		for (let i = 0; i < 17; i++) {
			lngProduct = lngProduct + varArray[i];
		}
		// calculate the check digit
		intCheckDigit = 12 - lngProduct % 11;
		switch (intCheckDigit) {
			case 10:
				intCheckDigit = 'X';
				break;
			case 11:
				intCheckDigit = 0;
				break;
			case 12:
				intCheckDigit = 1;
				break;
		}
		// check last digit
		if (varArray[17].toUpperCase() != intCheckDigit) {
			// error = "身份证效验位错误!...正确为： " + intCheckDigit + ".";
			// alert(error);
			return false;
		}
	} else { // length is 15
		// check date
		let date6 = idNumber.substring(6, 12);
		if (isDate6(date6) == false) {
			// alert("身份证日期信息有误！.");
			return false;
		}
	}
	// alert ("Correct.");
	return true;
}

function isDate8(sDate) {
	if (!/^[0-9]{8}$/.test(sDate)) {
		return false;
	}
	let year, month, day;
	year = sDate.substring(0, 4);
	month = sDate.substring(4, 6);
	day = sDate.substring(6, 8);
	let iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	if (year < 1700 || year > 2500)
		return false
	if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
		iaMonthDays[1] = 29;
	if (month < 1 || month > 12)
		return false
	if (day < 1 || day > iaMonthDays[month - 1])
		return false
	return true
}

export default {
	number,
	array
};
