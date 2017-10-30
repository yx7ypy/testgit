<template>
    <div>
        <div class="images-list clear-float">
            <a href="javascript:void(0)" class="image-ward" v-for="item in imageList" @click="showDialog(item)">
                <img :src="imageHost+item.url">
            </a>
        </div>
        <el-dialog v-model="dialogVisible" size="large">
            <img width="100%" :src="imageHost+itemImageUrl" alt="获取图片失败">
        </el-dialog>
    </div>
</template>

<script>
/**
 * 图片列表，点击查看大图组件
 * @imageUrl 图片url字符串，用英文逗号隔开
 */
import { basicConfig } from '@/config/config.js';
import '@/static/style/fengModule/imageList.scss'

export default {
    props: {
        imageUrl: String
    },
    data() {
        return {
        	imageHost:basicConfig.SHOW_PRI_IMG_HOST,
            itemImageUrl: '',
            dialogVisible: false
        }
    },
    computed: {
        imageList() {
            return this.imageUrl !== '' ? JSON.parse(this.imageUrl) : []
        }
    },
    methods: {
        showDialog(val) {
            this.itemImageUrl = val.url;
            this.dialogVisible = true;
        }
    }
}
</script>
