<template>
    <div label-position="left" label-width="0px"
         class="demo-ruleForm login-container">
        <h3 class="title">EMan</h3>
          <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2">
              <el-form-item prop="username">
                  <el-input type="text" v-model="ruleForm2.username" auto-complete="off"
                            placeholder="username"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                  <el-input type="password" v-model="ruleForm2.password" auto-complete="off"
                            placeholder="password"></el-input>
              </el-form-item>
              <el-form-item></el-form-item>
              <el-form-item style="width:100%;">
                  <el-button type="primary" style="width:100%;" @click.native.prevent="login"
                             :loading="logining">Sign in
                  </el-button>
              </el-form-item>
          </el-form>
    </div>
</template>

<script>
  import axios from 'axios';
    export default {
        data() {
            return {
                logining: false,
                ruleForm2: {
                    username: '',
                    password: ''
                },
                rules2: {
                    username: [
                        {required: true, message: 'Please input Username', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: 'Please input Password', trigger: 'blur'},
                    ]
                },
            };
        },
        methods: {
          login(ev) {
            let self = this;
            self.$refs.ruleForm2.validate((valid) => {
                  if (valid) {
                    self.logining = true;
                    let url="http://localhost:8081/user/login/";
                    var params = {
                        "loginId": this.ruleForm2.username,
                        "loginPassword": this.ruleForm2.password
                    };
                    axios.post(url, params).then(function(res) {
                          self.logining = false;
                            if (res.data == null) {
                              self.$message({
                                    message: res.error,
                                });
                            } else {
                                let user = res.data;
                              localStorage.setItem('user', JSON.stringify(user));
                              self.$router.push({path: '/'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style scoped>
    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 90px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .remember {
        margin: 0px 0px 35px 0px;
    }
    .login-label{
        width: 175px;
        margin-left: 94px;
    }
    .register-label{
        width: 175px;
        margin-right: 95px;
    }
</style>
