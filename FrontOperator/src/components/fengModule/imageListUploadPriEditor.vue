<template>
	<div>
		<el-upload drag :action="actionUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :on-success="handleAvatarScucess" :on-error="handleAvatarError" :file-list="imageUrl">
			<i class="el-icon-plus"></i>
		</el-upload>
		<el-dialog v-model="dialogVisible" size="small">
			<img width="100%" :src="dialogImageUrl" alt="获取图片失败">
		</el-dialog>
	</div>
</template>

<script>
	/**
	 * 多图片上传组件(最多5张)
	 * 上传成功和删除图片都出发自定义事件，向父组件传递新的图片数据
	 */
	import { basicConfig } from '@/config/config.js';
	import '@/static/style/fengModule/imagepriUpload.scss';

	export default {
		props: {
			imageUrl: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				dialogVisible: false,
				dialogImageUrl: [],
				actionUrl: basicConfig.UPLOAD_PRI_IMG_HOST,
				imageMax: 0
			}
		},
		methods: {
			showDialog(val) {
				this.itemImageUrl = val.url;
				this.dialogVisible = true;
			},
			handleRemove(file, fileList) {
				// 移除图片钩子
				let imageListUrl = []
				for(let item of fileList) {
					if(item.response) {
						imageListUrl.push(item.response.data);
					} else {
						imageListUrl.push(item.name);
					}
				}
				this.$emit('increment', imageListUrl)
			},
			handlePictureCardPreview(file) {
				// 查看大图
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			beforeAvatarUpload(file) {
				// 上传文件前的钩子
				if(this.imageMax >= 5) {
					this.$alert('最多上传5张图片;请选择合适的图片上传', '系统通知', { confirmButtonText: '确定', type: 'error' })
					return false
				}

				const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
				const isLt2M = file.size / 1024 / 1024 < 2

				if(!isJPG) {
					this.$message.error('上传的图片只能是 JPG/PNG 格式!')
				}
				if(!isLt2M) {
					this.$message.error('上传的图片大小不能超过 2MB!')
				}
				return isJPG && isLt2M
			},
			handleAvatarScucess(response, file, fileList) {
				// 图片上传成功钩子，使用自定义事件给父组件传数据
				//          console.log(response);
				//          console.log(fileList);
				if(response.status === 404) {
					this.$alert(response.data, '系统通知', { confirmButtonText: '确定', type: 'error' })
					return false
				}
				if (response.code != 2000) {
				    this.$alert(`服务器返回信息：${response.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
				}

				let imageListUrl = [];
				for(let item of fileList) {
					if(item.response) {
						if(null!=item.response.data){
							imageListUrl.push(item.response.data);
						}
					} else {
						imageListUrl.push(item.name);
					}
				}
				this.imageMax = imageListUrl.length;
				this.$emit('increment', imageListUrl)
			},
			handleAvatarError(err, file) {
				// 图片上传失败钩子
				this.$notify({ title: '系统通知', message: '图片上传失败，请确认图片格式大小正确后重试', type: 'error' })
			}
		}
	}
</script>