export const workJsplumb = {
  data() {
    return {
      jsPlumb: null, // jsPlumb 实例
      index: 1,
      // 默认设置参数
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: [
          "Top",
          "TopCenter",
          "TopRight",
          "TopLeft",
          "Right",
          "RightMiddle",
          "Bottom",
          "BottomCenter",
          "BottomRight",
          "BottomLeft",
          "Left",
          "LeftMiddle"
        ],
        Container: "flowContent",
        // 连线的样式 StateMachine、Flowchart,有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机）
        Connector: "Straight",
        //这个是鼠标拉出来的线的属性
        ConnectionOverlays: [
          [
            "Label",
            {
              label: "",
              id: "label-1",
              cssClass: "csslabel"
            }
          ]
        ],
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候节点不删除
        DeleteEndpointsOnDetach: false,
        // 连线的端点
        // Endpoint: ["Dot", {radius: 5}],
        Endpoint: [
          "Rectangle",
          {
            height: 10,
            width: 10
          }
        ],
        // 线端点的样式
        EndpointStyle: {
          fill: "rgba(255,255,255,0)",
          outlineWidth: 1
        },
        LogEnabled: true, //是否打开jsPlumb的内部日志记录
        // 绘制线
        PaintStyle: {
          stroke: "#409eff",
          strokeWidth: 2
        },
        // 绘制箭头
        Overlays: [
          [
            "Arrow",
            {
              width: 8,
              length: 8,
              location: 1
            }
          ]
        ],
        RenderMode: "svg"
      },
      // jsplumb连接参数
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault
        anchor: "Continuous"
      },
      jsplumbSourceOptions: {
        filter: ".flow-node-drag", //触发连线的区域
        /*"span"表示标签，".className"表示类，"#id"表示元素id*/
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      },
      jsplumbTargetOptions: {
        filter: ".flow-node-drag",
        /*"span"表示标签，".className"表示类，"#id"表示元素id*/
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      },
      // 是否加载完毕
      loadEasyFlowFinish: false,
      // 数据
      data: {
        nodeList: [],
        edges: []
      },
      currentItem: "", //临时存添加的元素
      isConnect: false, //判断是否连接
      timer: null, //定时器,判断单双击,
      currentConnect: "", //当前的连接线
      currentLine: "", //当前连接线数据
      editType: "" //编辑的类型
    }
  },
  methods: {
    getUUID() {
      return Math.random()
        .toString(36)
        .substr(3, 10);
    },
    drag(ev, item) {
      this.nodeObj = item;
    },
    dragend(event) { },
    drop(ev) {
      ev.preventDefault();
      let left = event.layerX + "px";
      let top = event.layerY + "px";
      this.node = {
        id: this.getUUID(),
        ...this.nodeObj,
        style: {
          left,
          top
        }
      };
      this.data.nodeList.push(this.node);
      this.addNode(this.node);
    },
    init() {
      const _this = this;
      this.jsPlumb.ready(function () {
        // 导入默认配置
        _this.jsPlumb.importDefaults(_this.jsplumbSetting);
        // 会使整个jsPlumb立即重绘。
        _this.jsPlumb.setSuspendDrawing(false, true);
        // 初始化节点
        // _this.loadEasyFlow();
        // 单点连接线（编辑label）,
        _this.jsPlumb.bind("click", function (conn, originalEvent) {
          //clearTimeout(this.timer);
          //this.timer = setTimeout(function () { // 这里采用执行自定义事件的方式
          //    console.log("click", conn);
          //    _this.editLine(conn);
          //}, 300); // 延迟300ms执行单击事件,区分双击事件
          console.log("click", conn);
          // _this.editLine(conn);
          console.log(conn.getOverlay("label-1"));
          //conn.getOverlay("label-1").setLabel('大肥肚'); //初始化label
        });
        // 双击连接线（删除）,
        _this.jsPlumb.bind("dblclick", function (conn, originalEvent) {
          clearTimeout(_this.timer);
          _this.$q.dialog({
            message: '你确定删除吗？',
            cancel: true,
            persistent: true
          }).onOk(() => {
            _this.jsPlumb.deleteConnection(conn);
          }).onCancel(() => {

          }).onDismiss(() => {

          })

        });
        // 连线
        _this.jsPlumb.bind("connection", function (evt) {
          console.log("connection", evt);
          let from = evt.source.id;
          let to = evt.target.id;
          if (_this.loadEasyFlowFinish) {
            _this.data.edges.push({
              source: from,
              target: to
            });
          }
          setTimeout(function () {
            // _this.editLine(evt.connection);
          }, 100);
        });
        // 删除连线
        _this.jsPlumb.bind("connectionDetached", function (evt) {
          console.log("connectionDetached", evt);
          _this.deleteLine(evt.sourceId, evt.targetId);
        });
        // 改变线的连接节点
        _this.jsPlumb.bind("connectionMoved", function (evt) {
          console.log("connectionMoved", evt);
          _this.changeLine(evt.originalSourceId, evt.originalTargetId);
        });
        // 单击endpoint
        // jsPlumb.bind("endpointClick", function (evt) {
        //   console.log('endpointClick', evt)
        // })
        //
        // // 双击endpoint
        // jsPlumb.bind("endpointDblClick", function (evt) {
        //   console.log('endpointDblClick', evt)
        // })
        // contextmenu 右键
        _this.jsPlumb.bind("contextmenu", function (evt) {
          console.log("contextmenu", evt);
        });
        // beforeDrop
        _this.jsPlumb.bind("beforeDrop", function (evt) {
          console.log("beforeDrop", evt);
          let from = evt.sourceId;
          let to = evt.targetId;
          if (from === to) {
            _this.$q.notify({
              message: "不能连接自己",
              position: "top",
              color: "purple"
            });
            return false;
          }
          if (_this.hasLine(from, to)) {
            _this.$q.notify({
              message: "不能重复连线",
              position: "top",
              color: "purple"
            });
            return false;
          }
          if (_this.hashOppositeLine(from, to)) {
            _this.$q.notify({
              message: "不能回环哦",
              position: "top",
              color: "purple"
            });
            return false;
          }
          return true;
        });
        // beforeDetach
        _this.jsPlumb.bind("beforeDetach", function (evt) {
          console.log("beforeDetach", evt);
        });

        _this.getDetail()
      });
    },
    // 加载节点
    loadNode() {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        this.addNode(node)
      }
    },
    // 初始化连接
    loadFlow() {
      // 初始化连线
      for (var i = 0; i < this.data.edges.length; i++) {
        let line = this.data.edges[i];
        let connection = this.jsPlumb.connect(
          {
            source: line.source,
            target: line.target
          },
          this.jsplumbConnectOptions
        );
        connection.getOverlay("label-1").setLabel('      '); //初始化label
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true;
      });
    },
    // 添加新的节点
    addNode(temp) {
      console.log("添加节点", temp);
      this.$nextTick(() => {
        this.jsPlumb.makeSource(temp.id, this.jsplumbSourceOptions);
        this.jsPlumb.makeTarget(temp.id, this.jsplumbTargetOptions);
        var _this = this
        this.jsPlumb.draggable(temp.id, {
          containment: "parent",  // 保证拖拽不跨界
          drag: function (event) {
            // console.log("拖动开始",event)
          },
          stop: function (event) {
            let dragNodeId = event.el.id;
            for (let index = 0; index < _this.data.nodeList.length; index++) {
              const obj = _this.data.nodeList[index];
              if (obj.id == dragNodeId) {
                console.log("拖动", event);
                _this.data.nodeList[index].style.top = event.pos[1] + 'px';
                _this.data.nodeList[index].style.left = event.pos[0] + 'px';
                break
              }
            }

          }
        });
      });
    },
    // 删除线
    deleteLine(from, to) {
      this.data.edges = this.data.edges.filter(function (line) {
        return line.source !== from && line.target !== to;
      });
    },
    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo);
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        if (node.id === data.nodeId) {
          node.left = data.left;
          node.top = data.top;
        }
      }
    },
    //删除节点
    deleteNode(nodeId) {
      let edges = this.data.edges.filter(o => (o.source == nodeId || o.target == nodeId))
      if (edges.length > 0) {
        this.$q.notify({
          message: '该模块与其他模块有连线，请删除与之相关的连线，在删除该模块'
        })
        return
      }
      this.$q.dialog({
        message: '你确定删除吗？',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.data.nodeList.forEach((item, index) => {
          if (item.id === nodeId) {
            this.data.nodeList.splice(index, 1);
          }
        });
        this.$nextTick(function () {
          console.log("删除" + nodeId);
          this.jsPlumb.removeAllEndpoints(nodeId);
        });
        return true;
      }).onCancel(() => {

      }).onDismiss(() => {

      })

    },
    //删除线
    delLine(conn) {
      this.$q.dialog({
        message: '你确定删除吗？',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.jsPlumb.deleteConnection(conn);
      }).onCancel(() => {

      }).onDismiss(() => {

      })
    },
    // 是否具有该线
    hasLine(from, to) {
      for (var i = 0; i < this.data.edges.length; i++) {
        var line = this.data.edges[i];
        if (line.source === from && line.target === to) {
          return true;
        }
      }
      return false;
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from);
    },
    lineLabelSave(line) {
      this.currentConnect.getOverlay("label-1").setLabel(line.label);
      //this.$set(this.currentLine, 'label', line.label);
    },

  },
  mounted() {
    this.jsPlumb = this.$jsPlumb.getInstance();
    this.jsPlumb.reset();
    this.$nextTick(() => {
      this.init();
    });
  }
}