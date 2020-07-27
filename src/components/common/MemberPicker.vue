<template>
  <el-cascader
    :value="[structureId, touristId]"
    :props="props"
    :options="options"
    @focus="handleFocus"
    @change="handleChane"
  ></el-cascader>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'MemberPicker',
    model: {
      prop: 'touristId',
      event: 'change'
    },
    data () {
      return {
        structureId: 0,
        value: [],
        options: [],
        props: {
          lazy: true,
          lazyLoad (node, resolve) {
            const { level } = node
            if (level === 0) {

            } else if (node.children && node.children.length) {
              resolve([])
            } else {
              new Vue().$http.get('/apis/person/tourist', {
                params: {
                  structure_id: node.value,
                  per_page: 100
                }
              }).then(res => {
                resolve(res.data.data.data.map(item => {
                  return {
                    value: item.tourist_id,
                    label: item.name,
                    leaf: true
                  }
                }))
              })
            }
          }
        }
      }
    },
    props: ['touristId', 'width', 'height', 'tips'],
    methods: {
      handleChane(value) {
        this.structureId = value[0]
        this.$emit('change', value[1])
      },
      handleFocus () {
      },
      fetchStructureList (structureId) {
        this.$http.all([
          this.$http.get('/apis/person/structure'),
          this.$http.get('/apis/person/tourist', {
            params: {
              structure_id: structureId,
              per_page: 100
            }
          })
        ]).then(this.$http.spread((structureList, tourists) => {
          this.options = structureList.data.data.map(row => {
            let structure = {
              value: row.id,
              label: row.name,
              leaf: false
            }

            if (row.id === structureId) {
              structure.children = tourists.data.data.data.map(row => {
                return {
                  value: row.tourist_id,
                  label: row.name,
                  leaf: true
                }
              })
            }
            return structure
          })

        }))
      }

    },
    mounted () {
      if (this.touristId) {
        this.$http.get('/apis/person/tourist', {
          params: {
            tourist_id: this.touristId,
            per_page: 100
          }
        }).then(res => {
          if (res.data.data.data && res.data.data.data.length) {
            this.structureId = res.data.data.data[0].structure_id
            this.fetchStructureList(this.structureId)
          }
        })
      } else {
        this.fetchStructureList(1)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .single-image-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .single-image-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .single-image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }

  .upload-tips {
    font-size: 12px;
    color: #606266;
    margin-top: -12px;
  }
</style>
