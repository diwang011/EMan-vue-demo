<template>
    <section>
        <!--工具条-->
        <el-col :span="10" class="toolbar" >
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-autocomplete placeholder="mouldName" v-model="filters.mouldName" :fetch-suggestions="querySearchAsync"
                                     clearable ></el-autocomplete>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getMouldList" >查询</el-button>
                  <el-button type="primary" @click="addMould" >添加</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="moulds" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" ></el-table-column>
            <el-table-column prop="id" label="id"   v-if="false"></el-table-column>
            <el-table-column prop="mouldName" label="mouldName" ></el-table-column>
            <el-table-column prop="mouldType" label="mouldType" ></el-table-column>
            <el-table-column prop="number" label="number" ></el-table-column>
            <el-table-column prop="deliveryDate" label="deliveryDate" sortable></el-table-column>
            <el-table-column prop="remark" label="remark" ></el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                         :total="total" style="float:right;">
          </el-pagination>
        </el-col>

      <el-dialog title="AddMould" :visible.sync="addMouldFormVisible" :close-on-click-modal="false" center >
        <el-form :model="addMouldForm" label-width="120px" :rules="addMouldFormRules"
                 ref="addMouldForm">
          <el-form-item label="mouldName" prop="mouldName">
            <el-input v-model="addMouldForm.mouldName" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="mouldType" prop="mouldType">
            <el-input v-model="addMouldForm.mouldType" auto-complete="off" ></el-input>
            <!--<el-tree :data="muldTypeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>-->
          </el-form-item>
          <el-form-item label="number" prop="number">
            <el-input v-model="addMouldForm.number" auto-complete="off" type="number"></el-input>
          </el-form-item>
          <el-form-item label="deliveryDate" required>
            <el-date-picker v-model="addMouldForm.deliveryDate" type="datetime"
                            placeholder="Choose time"></el-date-picker>
          </el-form-item>
          <el-form-item label="remark" prop="remark">
            <el-input v-model="addMouldForm.remark" auto-complete="off" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addMouldFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addMouldFormSubmit" :loading="addMouldLoading">提交
          </el-button>
        </div>
      </el-dialog>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                filters: {
                  mouldName: '',
                },
                timeout:  null,
                moulds: [],
                total: 2,
                pageNumber: 0,
                pageSize:20,
                listLoading: false,

              addMouldFormVisible: false,
              addMouldLoading: false,
              addMouldFormRules: {
                mouldName: [
                  {required: true, message: 'Please enter the currentPrice !', trigger: 'blur'}
                ],
                number: [
                  {required: true, message: 'Please enter the comparisonPrice !', trigger: 'blur'}
                ],
                mouldType: [
                  {required: true, message: 'Please enter the priceType', trigger: 'change'}
                ],
                deliveryDate: [
                  {
                    type: 'date',
                    required: true,
                    message: 'Please choose the right effectiveDate !',
                    trigger: 'change'
                  }
                ]
              },
              //新增界面数据
              addMouldForm: {
                mouldName: '',
                number: '',
                mouldType: '',
                deliveryDate: '',
                remark: '',
              },
            }
        },
        methods: {
            handleCurrentChange(val) {
              this.pageNumber = val;
              this.getMouldList();
             },
          handleData: function (op, res, oo) {
            let message = '';
            let type = '';
            if (res.error != null) {
              message = res.error;
              type = 'warning';
            } else {
              if (res.data == null || ((res.data) == false)) {
                message = op + '失败';
                type = 'warning';
              } else {
                message = op + '成功';
                type = 'success';
              }
            }
            oo.$message({
              message: message,
              type: type
            });
          },
            //获取order列表
            getMouldList() {
              let self = this;
              let url="http://localhost:8081/mould/search/";
              let params = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    data: this.filters.mouldName,
                };
              self.listLoading = true;
              //alert(JSON.stringify(params));
              self.$axios.post(url, params).then(function(res) {
                //alert(JSON.stringify( res.data));
                if (res) {
                  self.total = res.data.totalElements;
                  self.moulds = res.data.content;
                  self.listLoading = false;
                  }
                });
            },
          addMould : function(){
            this.addMouldFormVisible = true;
          },
          //关闭Dialog
          close: function () {
            this.closeDialog();
          },
          //新增模具
          addMouldFormSubmit: function () {
            let self = this;
            this.$refs.addMouldForm.validate((valid) => {
              if (valid) {
                self.$confirm('Are you sure to submit？', 'title', {}).then(() => {
                  self.addMouldLoading = true;
                  let para = Object.assign({}, self.addMouldForm);
                  let params = {
                    data: para
                  };
                  let url="http://localhost:8081/mould/save/";
                  self.$axios.post(url, params).then(function(res) {
                    if (res) {
                      self.addMouldLoading = false;
                      let op = '新增模具 ';
                      self.handleData(op, res, this);
                      self.addMouldFormVisible = false;
                      self.getMouldList();
                    }
                  });
                });
              }
            });
          },
          querySearchAsync(queryString, cb) {
            let self = this;
            if (queryString==""){
              return;
            }
            let url="http://localhost:8081/mould/searchMouldName/";
            let params = {
              data: queryString
            };
            self.$axios.post(url, params).then(function(res) {
                if (res) {debugger;
                  var   results=res;
                  clearTimeout(self.timeout);
                  self.timeout = setTimeout(() => {
                    cb(results);
                  }, 3000 * Math.random());
                }
            });
          },
        },
        mounted()
        {
            this.getMouldList();
        }
    }
</script>
