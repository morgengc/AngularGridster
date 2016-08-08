angular.module('app')

/**
 * index.html 中引用的控制器，用于控制 Dashboard 页
 *
 * @method DashboardCtrl
 * @param {Object} $scope       HTML与控制器之间绑定数据
 * @param {Object} $timeout     定时器
 * @return undefined
 */
.controller('DashboardCtrl', ['$scope', '$timeout',
function($scope, $timeout) {
    // gridster选项
    $scope.gridsterOptions = {
        margins: [20, 20],
        // 栅格边距
        columns: 4,
        // 每行多少个栅格
        draggable: {
            // 限定只能在h3标签上拖动栅格
            handle: 'h3'
        }
    };

    // 全局变量，定义了两个版面
    $scope.dashboards = {
        '1': {
            id: '1',
            name: 'Home',
            widgets: [{
                col: 0,
                row: 0,
                sizeY: 1,
                sizeX: 1,
                name: "Widget 1"
            }, {
                col: 2,
                row: 1,
                sizeY: 1,
                sizeX: 1,
                name: "Widget 2"
            }]
        },
        '2': {
            id: '2',
            name: 'Other',
            widgets: [{
                col: 1,
                row: 1,
                sizeY: 1,
                sizeX: 2,
                name: "Other Widget 1"
            }, {
                col: 1,
                row: 3,
                sizeY: 1,
                sizeX: 1,
                name: "Other Widget 2"
            }]
        }
    };

    // 清空当前版面的栅格. 由于是双向绑定，变量清空画面就跟着清空了
    // TODO dashboard还未定义，就可以定义widgets吗?
    $scope.clear = function() {
        $scope.dashboard.widgets = [];
    };

    // 添加一个新的栅格
    // $scope.dashboard.widgets 是一个 object 类型，因此可以使用 push() 方法
    $scope.addWidget = function() {
        $scope.dashboard.widgets.push({
            name: "New Widget",
            sizeX: 1,
            sizeY: 1
        });
    };

    // 监控 selectedDashboardId 变量，当发生改变时切换版面
    $scope.$watch('selectedDashboardId', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.dashboard = $scope.dashboards[newVal];
        } else {
            $scope.dashboard = $scope.dashboards[1];
        }
    });

    // init dashboard
    $scope.selectedDashboardId = '1';

}
])

/**
 * view.html 中引用的控制器，用于控制每个栅格，对应栅格标题栏的控制按钮
 *
 * @method CustomWidgetCtrl
 * @param {Object} $scope       HTML与控制器之间绑定数据
 * @param {Object} $modal       模态窗体
 * @return undefined
 */
.controller('CustomWidgetCtrl', ['$scope', '$modal',
function($scope, $modal) {

    // 删除一个栅格，在 view.html 中引用
    // 参数 widget 由 HTML 传入
    // splice() 的作用是从数组中删除某些元素，它是 JavaScript 的基本方法之一
    $scope.remove = function(widget) {
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
    };

    // 配置一个栅格，在 view.html 中引用
    // 参数 widget 由 HTML 传入
    // resolve() 中 返回 widget，保证了数据获取后再跳转路由，
    // 这样操作避免了跳转路由后数据还没有获取完成而可能带来的页面闪烁问题。体验也更好
    $scope.openSettings = function(widget) {
        $modal.open({
            scope: $scope,
            templateUrl: 'demo/dashboard/widget_settings.html',
            controller: 'WidgetSettingsCtrl',
            resolve: {
                widget: function() {
                    return widget;
                }
            }
        });
    };

}
])

/**
 * widget_settings.html 中引用的控制器，在弹出的模态窗口中配置栅格属性
 *
 * @method WidgetSettingsCtrl
 * @param {Object} $scope          HTML与控制器之间绑定数据
 * @param {Object} $timeout        定时器
 * @param {Object} $rootScope      用于共享数据
 * @param {Object} $modalInstance  模态框
 * @param {Object} widget          栅格对象，由上面的resolve()方法注入
 * @return undefined
 */
.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
function($scope, $timeout, $rootScope, $modalInstance, widget) {
    $scope.widget = widget;

    // 记录栅格的物理属性
    $scope.form = {
        name: widget.name,
        sizeX: widget.sizeX,
        sizeY: widget.sizeY,
        col: widget.col,
        row: widget.row
    };

    // 可有可无 没看出来有什么用
    $scope.sizeOptions = [{
        id: '1',
        name: '1'
    }, {
        id: '2',
        name: '2'
    }, {
        id: '3',
        name: '3'
    }, {
        id: '4',
        name: '4'
    }];

    // 关闭配置窗口
    $scope.dismiss = function() {
        $modalInstance.dismiss();
    };

    // 删除栅格并关闭配置窗口
    $scope.remove = function() {
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        $modalInstance.close();
    };

    // 修改栅格属性，并且关闭配置窗口
    // angular.extend(dst, src)
    // form 对象在 HTML 中被改变，将改变应用到原栅格上即可
    $scope.submit = function() {
        angular.extend(widget, $scope.form);

        $modalInstance.close(widget);
    };

}
])

// helper code
.filter('object2Array', function() {
    return function(input) {
        var out = [];
        for (i in input) {
            out.push(input[i]);
        }
        return out;
    }
});
