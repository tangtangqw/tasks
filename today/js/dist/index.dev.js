"use strict";

// $(function () {

/**
 * 返回指定format的string
 * format eg:'yyyy-MM-dd hh:mm:ss'
 **/
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }

  return format;
};

$(".tr-summary textarea").val(window.localStorage.getItem("summary"));
var now = new Date().format("dd");
var doneList = null;
var yestoday = window.localStorage.getItem("date") || new Date().format("dd");

if (now !== yestoday) {
  window.localStorage.removeItem("todayTask");
  window.localStorage.removeItem("date");
  window.localStorage.removeItem("summary");
}

var todayTask = [];
var todayDate = ["07:00-08:00", "08:00-09:00", "09:00-12:00", "12:00-13:10", "13:10-18:00", "18:00-20:00", "20:00-22:00", "22:00-23:00", "23:00-07:00"];
$(".table").on("click", ".add-task", function () {
  $(this).parents(".tr").find(".popup").toggleClass("active");
});
var tasks = [];
var popupText = [];

if (!!window.localStorage.getItem("todayTask")) {
  tasks = window.localStorage.getItem("todayTask").split(',');
}

if (!!window.localStorage.getItem("time")) {
  todayDate = window.localStorage.getItem("time").split(',');
}

if (!!window.localStorage.getItem("popup")) {
  popupText = window.localStorage.getItem("popup").split(',');
} // 模板的编译


var compiledTemplate = Hogan.compile($("#table").html()); // 模板的渲染

var result = compiledTemplate.render({
  todayDate: todayDate
});
$(".table").html(result);
var input = $('.task input');
var time = $('.time');
var popup = $('.popup textarea');
input.map(function (index, data) {
  this.value = tasks[index] || "";
});
time.map(function (index, data) {
  this.innerHTML = todayDate[index] || "";
});
popup.map(function (index, data) {
  this.value = popupText[index] || "";
});
$(".tr-summary textarea").on("blur", function () {
  input.map(function (index, data) {
    tasks[index] = this.value;
    console.log(this.value);
  });
  time.map(function (index, data) {
    todayDate[index] = this.innerHTML;
  });
  popup.map(function (index, data) {
    popupText[index] = this.value;
  });
  doneList = JSON.stringify({
    "date": new Date().format("mm-dd"),
    "time": todayDate,
    "tasks": tasks,
    "popup": popupText,
    "summary": this.value
  });
  window.localStorage.setItem('todayTask', tasks);
  window.localStorage.setItem('date', new Date().format("dd"));
  window.localStorage.setItem('time', todayDate);
  window.localStorage.setItem('summary', this.value);
  window.localStorage.setItem('popup', popupText);
  window.localStorage.setItem("todayThings", doneList);
});
console.table(JSON.parse(window.localStorage.getItem("todayThings"))); // })