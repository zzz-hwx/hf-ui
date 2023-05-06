<template>
	<view class="hf-upload">
		<view class="hf-upload__wrap">
			<template v-if="previewImage">
				<view
					class="hf-upload__wrap__preview"
					v-for="(item, index) in lists" :key="index">
					<template>
						<image v-if="item.isImage"
							:src="item.url"
							:mode="imageMode"
							class="hf-upload__wrap__preview__image"
							:style="[{
								width: $u.addUnit(width),
								height: $u.addUnit(height)
							}]"
							@click="onPreviewImage(item)"></image>
						<template v-else>
							<view class="hf-upload__wrap__preview__other" @click="onPreviewVideo(item)">
								<u-icon :color="primaryColor" size="26" :name="item.isVideo ? 'movie' : 'folder'"></u-icon>
								<text class="hf-upload__wrap__preview__other__text">{{ item.isVideo ? '视频' : '文件' }}</text>
							</view>
							<u-overlay :show="showVideo" @click="showVideo = false">
								<view class="hf-upload__wrap__preview__other__video" @tap.stop>
									<hf-video :videoSrc="item.url"></hf-video>
								</view>
							</u-overlay>
						</template>
					</template>
					
					<template>
						<view class="hf-upload__status" v-if="item.status === 'uploading' || item.status === 'failed'">
							<view class="hf-upload__status__icon">
								<u-icon v-if="item.status === 'failed'" name="close-circle" color="#ffffff" size="25"></u-icon>
								<u-loading-icon v-else size="22" mode="circle" color="#ffffff"></u-loading-icon>
							</view>
							<text v-if="item.message" class="hf-upload__status__message" >{{ item.message }}</text>
						</view>
					</template>
					
					<template>
						<view
							v-if="item.status !== 'uploading' && (deletable || item.deletable) && !disabled"
							class="hf-upload__deletable"
							@click.stop="deleteItem(index)">
							<view class="hf-upload__deletable__icon">
								<u-icon name="close" color="#ffffff" size="10"></u-icon>
							</view>
						</view>
					</template>
					
					<template>
						<view
							v-if="item.status === 'success'"
							class="hf-upload__success">
							<view class="hf-upload__success__icon">
								<u-icon name="checkmark" color="#ffffff" size="12"></u-icon>
							</view>
						</view>
					</template>
				</view>
			</template>
			
			<template v-if="isInCount && (!disabled || (disabled && !disableNoShowBtn))">
				<view v-if="$slots.default || $slots.$default" @click="chooseFile">
					<slot></slot>
				</view>
				<view v-else
					class="hf-upload__button"
					:class="[disabled && 'hf-upload__button--disabled']"
					:style="[{
						width: $u.addUnit(width),
						height: $u.addUnit(height)
					}]"
					@click="chooseFile">
					<u-icon :name="uploadIcon" size="26" :color="uploadIconColor"></u-icon>
					<text v-if="uploadText" class="u-upload__button__text">{{ uploadText }}</text>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	import props from '@/uni_modules/uview-ui/components/u-upload/props.js';
	import HfVideo from './hf-video.vue';
	import { chooseImage, chooseFile } from '@/uni_modules/hf-middleware/js_sdk/index.js';
	import loadData from '../../libs/util/loadData.js';
	export default {
		name: 'HfUpload',
		mixins: [props],
		components: {
			HfVideo
		},
		props: {
			value: {
				type: String,
				default: ''
			},
			accept: {
				type: String,
				default: 'image',
				validator: (val) => {
					return ['image', 'video', 'media'].includes(val);
				}
			},
			maxCount: {		// 最大选择图片的数量
				type: Number,
				default: 9
			},
			separator: {	// 分隔符
				type: String,
				default: ','
			},
			bizPath: {	// 控制文件上传的业务路径
				type: String,
				default: 'temp'
			},
			maxSize: {
				// 选择单个文件的最大大小，单位B(byte)，默认不限制
				type: [String, Number],
				default: Number.MAX_VALUE
			},
			disableNoShowBtn: {
				// 禁用状态 是否不显示选择文件按钮
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				primaryColor: uni.$u.config.color['u-primary'],
				showVideo: false,
				lists: [],
				/**
				 * url: 可访问路径(绝对路径)
				 * path: 相对路径(id)
				 * isImage: 是否图片
				 * isVideo: 是否视频
				 * deletable: 是否可删除
				 * status: 状态
				 * 		uploading	上传中
				 * 		failed		上传失败
				 * 		success		上传成功
				 * message: 提示信息
				 */
			}
		},
		watch: {
			value: {
				async handler(val) {
					let lists = [];
					if (val && val.length) {
						lists = val.split(this.separator);
					}
					const absList = await loadData.getAbsPath(val);
					this.lists = lists.map((path, index) => {
						const i = this.lists.findIndex(item =>(item.path === path));
						if (i !== -1) {
							return this.lists[i];
						}
						return {
							url: absList[index].url || '',	// 绝对路径
							path,	// 相对路径 id
							isImage: this.accept === 'image' || uni.$u.test.image(absList[index].name),
							isVideo: this.accept === 'video' || uni.$u.test.video(absList[index].name),
							deletable: this.deletable,
						};
					});
				},
				immediate: true
			}
		},
		computed: {
			isInCount() {
				return this.lists.length < this.maxCount
			}
		},
		methods: {
			async chooseFile() {
				if (this.disabled) return;
				let res;
				if (this.accept === 'image') {
					res = await chooseImage({ count: this.maxCount - this.lists.length });
				} else if (this.accept === 'video') {
					res = await chooseVideo();
				} else if (this.accept == 'media'){
					res = await chooseFile();
				}
				this.onBeforeRead(res);
				this.onAfterRead(res);
			},
			onBeforeRead(fileArr) {
				// 文件读取之前
				// ... 一些操作
			},
			async onAfterRead(fileArr) {
				const fileListLen = this.lists.length;
				const list = fileArr.map(item => {
					return {
						url: item.path,
						status: 'uploading',
						message: '上传中',
						isImage: this.accept === 'image' || uni.$u.test.image(item.name || item.thumb),
						isVideo: this.accept === 'video' || uni.$u.test.video(item.name || item.thumb),
					};
				})
				this.lists.push(...list);
				for (let i = 0; i < fileArr.length; i++) {
					const index = fileListLen + i;
					const item = this.lists[index];
					if (fileArr[i].size > this.maxSize) {
						// 文件大小限制判断
						this.lists.splice(index, 1, Object.assign(item, {
							status: 'failed',
							message: '文件大小超过限制'
						}));
						continue;
					}
					try {
						const result = await loadData.uploadFile(fileArr[i], { bizPath: this.bizPath });	// 文件上传
						this.lists.splice(index, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.url,	// 上传后 使用本地临时路径
							path: result.path
						}));
					} catch(e) {
						this.lists.splice(index, 1, Object.assign(item, {
							status: 'failed',
							message: '上传失败'
						}));
					}
				}
				
				this.handleInput();
			},
			deleteItem(index) {
				// 删除图片
				this.lists.splice(index, 1);
				this.handleInput();
			},
			handleInput() {
				this.$emit('input', this.lists.map((item) => (item.path)).filter(Boolean).join(this.separator));
			},
			onPreviewImage(item) {
				// 预览图片
				console.log('onPreviewImage', item);
				if (!item.isImage) return;
				uni.previewImage({
					// 先filter找出为图片的item，再返回filter结果中的图片url
					urls: this.lists.filter((item) => (this.accept === 'image' || item.isImage)).map((item) => (item.url || item.thumb)),
					current: item.url || item.thumb,
					fail: () => {
						uni.$u.toast('预览图片失败');
					}
				});
			},
			onPreviewVideo(item) {
				// 预览视频
				if (!item.isVideo) return;
				this.showVideo =  true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	$hf-upload-image-width: 80px;
	$hf-upload-image-height: $hf-upload-image-width;
	$hf-upload-button-width: 80px;
	$hf-upload-button-height: $hf-upload-button-width;
	.hf-upload {
		display: flex;
		flex-direction: column;
		flex: 1;
		&__wrap {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			flex: 1;
			&__preview {
				border-radius: 2px;
				margin: 0 8px 8px 0;
				position: relative;
				overflow: hidden;
				display: flex;
				flex-direction: row;
				&__image {
					width: $hf-upload-image-width;
					height: $hf-upload-image-height;
				}
				&__other {
					width: $hf-upload-image-width;
					height: $hf-upload-image-height;
					background-color: $u-bg-color;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					&__text {
						font-size: $font-xs;
						color: $u-tips-color;
						margin-top: 2px;
					}
					&__video {
						margin-top: 30vh;
					}
				}
			}
		}
		&__status {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: rgba(0, 0, 0, 0.5);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			&__icon {
				position: relative;
				z-index: 1;
			}
			&__message {
				font-size: $font-xs;
				color: $bg-white;
				margin: $xs $xs 0;
				text-align: center;
			}
		}
		&__deletable {
			position: absolute;
			top: 0;
			right: 0;
			background-color: #373737;
			height: 14px;
			width: 14px;
			display: flex;
			flex-direction: column;
			border-bottom-left-radius: 100px;
			align-items: center;
			justify-content: center;
			z-index: 3;
			&__icon {
				position: absolute;
				transform: scale(0.7);
				top: 0;
				right: 0;
			}
		}
		&__success {
			position: absolute;
			bottom: 0;
			right: 0;
			display: flex;
			border-style: solid;
			border-top-color: transparent;
			border-left-color: transparent;
			border-bottom-color: $u-success;
			border-right-color: $u-success;
			border-width: 9px;
			align-items: center;
			justify-content: center;
			&__icon {
				position: absolute;
				transform: scale(0.7);
				bottom: -10px;
				right: -10px;
			}
		}
		&__button {
			width: $hf-upload-button-width;
			height: $hf-upload-button-height;
			background-color: $u-bg-color;
			display: flex;
			justify-content: center;
			align-items: center;
			&--disabled {
				opacity: 0.5;
			}
			&__text {
				font-size: $font-xs;
				color: $u-tips-color;
				margin-top: 2px;
			}
		}
	}
</style>