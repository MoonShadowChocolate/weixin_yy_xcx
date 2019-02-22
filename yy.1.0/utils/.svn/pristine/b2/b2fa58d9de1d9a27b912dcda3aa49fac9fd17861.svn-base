//设置单一价格样式
module.exports.setOnePriceStyle = function (price) {
  var price = price.toString();
  var newPrice = "";
  var count = 0;
  if (price.indexOf(".") == -1) {
    for (var i = price.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newPrice = price.charAt(i) + "," + newPrice;
      } else {
        newPrice = price.charAt(i) + newPrice;
      }
      count++;
    }
    price = newPrice + ".00";
    return price;
  }
  else {
    for (var i = price.indexOf(".") - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newPrice = price.charAt(i) + "," + newPrice;
      } else {
        newPrice = price.charAt(i) + newPrice;
      }
      count++;
    }
    price = newPrice + (price + "00").substr((price + "00").indexOf("."), 3);
    return price;
  }
}
//处理小数乘法运算的函数
module.exports.accMul = function (arg1, arg2) {
  console.log(arg1,arg2);
  var m = 0, s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) { }
  try {
    m += s2.split(".")[1].length
  } catch (e) { }
  return (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m
  )).toFixed(2);
}
//处理小数除法的运算
module.exports.accDiv = function(arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
  }
  try {
    t2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
  }
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return ((r1 / r2) * Math.pow(10, t2 - t1)).toFixed(2);
}
//处理小数减法运算的函数
module.exports.accSub = function (arg1, arg2) {
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  //last modify by deeka  
  //动态控制精度长度  
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(2);
}