onmessage = function (e) {
    var flag = false;
    var notMatch = false;
    var finish = 0;
    var wrong = 0;
    for (var i in e.data.jdata) {
        if (!flag) {
            if (typeof (e.data.jdata[i]) == "object") {
                for (var m in e.data.jdata[i]) {
                    if (typeof (e.data.jdata[i][m]) == "object") {
                        var fieldData = {};
                        for (var n in e.data.jdata[i][m]) {
                            var index = e.data.titleArray.indexOf(n);
                            if (index != -1) {
                                fieldData[e.data.columnArray[index]] = e.data.jdata[i][m][n];
                            }
                        }
                        var fmark = true;
                        for (var item in fieldData) {
                            fmark = false;
                        }
                        if (fmark) {
                            notMatch = true;
                            break;
                        } else {
                            var url = e.data.url + "service/appletData";
                            var xmlHttpRequest = new XMLHttpRequest();
                            xmlHttpRequest.onreadystatechange = function () {
                                if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                                    finish++;
                                } else if (xmlHttpRequest.status == 500) {
                                    wrong++;
                                }
                            };
                            xmlHttpRequest.open("POST", url, false);
                            var formData = new FormData();
                            formData.append("tenantId", e.data.tenantId);
                            formData.append("userId", e.data.userId);
                            formData.append("appletId", e.data.applet);
                            formData.append("fieldData", JSON.stringify(fieldData));
                            xmlHttpRequest.send(formData);
                        }
                    }
                }
            }
            flag = true;
        }
    }
    if (notMatch) {
        postMessage("文件不匹配");
    } else {
        postMessage("导入完成：成功" + finish + "，失败" + wrong);
    }
};