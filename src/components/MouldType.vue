<template>
    <section>
      <el-tree :data="muldTypeData" :props="defaultProps" node-key="id"   @node-click="handleNodeClick"></el-tree>
    </section>
</template>

<script>
    export default {
        data() {
            return {
              muldTypeData:  [],
              defaultProps: {
                children: 'children',
                label: 'mouldTypeName'
              }
            }
        },
        methods: {
          handleNodeClick() {
            console.log();
          },
          muldTypeDataList(){
            let self = this;
            let url="http://localhost:8081/mouldType/search/";
            self.$axios.post(url).then(function(res) {
              if (res) {
                self.muldTypeData = res.data;
              }
            });
          },
        },
        mounted()
        {
          this.muldTypeDataList();
        }
    }
</script>
