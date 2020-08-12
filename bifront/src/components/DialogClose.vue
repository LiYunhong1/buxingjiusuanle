<template>
    <div>
        <q-dialog v-model="value" @input="updateVal" persistent class="dialog-close">
      <q-card style="max-width:100%;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{title||""}}</div>
          <q-space />
          <q-btn @click="updateVal(false)" icon="close" flat round dense v-close-popup />
        </q-card-section>
        <slot></slot>
      </q-card>
    </q-dialog>
    </div>
</template>

<script>
    export default {
        name: '',
        model:{
            prop:'value',
            event:'dialog'
        },
        props:{
            value:{
                type:Boolean,
                default:false
            },
            title:{
                type:String,
                default:''
            }
        },
        data() {
            return {
                
            }
        },
        methods: {
            updateVal(val){
                this.$emit('dialog',val)
            }
        },
    }
</script>

<style scoped>
    .dialog-close{
        min-width: 40%;
        max-width: 100% !important;
    }
</style>