/**
 * Created by sks on 2017/6/27.
 * 获取localStorage，和存储localStorage
 */
(function (exports) {

    'use strict';

    exports.gameStorage = {
        fetch: function (STORAGE_KEY) {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        },
        save: function (STORAGE_KEY, data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    };

})(window);
