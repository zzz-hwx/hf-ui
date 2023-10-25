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
						<template v-else-if="item.isVideo">
							<view class="hf-upload__wrap__preview__other" @click="onPreviewVideo(item)">
								<u-icon :color="primaryColor" size="26" name="movie"></u-icon>
								<text class="hf-upload__wrap__preview__other__text">视频</text>
							</view>
						</template>
						<template v-else>
							<view class="hf-upload__wrap__preview__other" @click="onPreviewFile(item)">
								<hf-icon v-if="item.ext === 'xls' || item.ext === 'xlsx'" color="#16ac52" size="26" name="file-excel-fill"></hf-icon>
								<hf-icon v-else-if="item.ext === 'ppt' || item.ext === 'pptx'" color="#f07010" size="26" name="file-ppt-fill"></hf-icon>
								<hf-icon v-else-if="item.ext === 'doc' || item.ext === 'docx'" color="#1c90ff" size="26" name="file-word-fill"></hf-icon>
								<hf-icon v-else-if="item.ext === 'pdf'" color="#e53833" size="26" name="file-pdf-fill"></hf-icon>
								<hf-icon v-else-if="item.ext === 'md'" color="#b2b2b2" size="26" name="file-markdown-fill"></hf-icon>
								<hf-icon v-else-if="item.ext === 'txt'" color="#adadad" size="26" name="file-text-fill"></hf-icon>
								<hf-icon v-else-if="item.ext === 'zip'" color="#f4b209" size="26" name="file-zip-fill"></hf-icon>
								<hf-icon v-else :color="primaryColor" size="26" name="file-fill"></hf-icon>
								<text class="hf-upload__wrap__preview__other__text u-line-2">{{ item.name | filterFileName }}</text>
							</view>
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
								<u-icon name="close" color="#ffffff" size="16"></u-icon>
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
		
		<!-- 预览视频 -->
		<u-overlay :show="previewVideoVis" @click="previewVideoVis = false">
			<view class="hf-upload__overlay">
				<view class="hf-upload__overlay__video" @tap.stop>
					<hf-video :videoSrc="previewVideoUrl"></hf-video>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import props from '@/uni_modules/uview-ui/components/u-upload/props.js';
	import HfVideo from './hf-video.vue';
	import { chooseImage, chooseVideo, chooseMedia, chooseFile, openDocument } from '@/uni_modules/hf-middleware/js_sdk/index.js';
	import loadData from '../../libs/util/loadData.js';
	export default {
		name: 'HfUpload',
		mixins: [props],
		components: {
			HfVideo
		},
		filters: {
			filterFileName(name) {
				const extIndex = name.lastIndexOf('.');
				if (extIndex === -1) {
					return '文件';
				}
				const ext = name.substring(extIndex + 1);	// 扩展名 jpg mp4
				const showLen = 8;
				if (showLen > extIndex) {
					return name;
				} else {
					const fileName = name.substring(0, showLen);
					return `${fileName}...${ext}`;
				}
			},
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
					// image-图片 video-视频 media-图片或视频 file-文件(未实现预览)
					return ['image', 'video', 'media', 'file'].includes(val);
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
			maxDuration: {
				// 拍摄视频最长拍摄时间，单位秒
				type: Number,
				default: uni.$u.props.upload.maxDuration
			},
			disableNoShowBtn: {
				// 禁用状态 是否不显示选择文件按钮
				type: Boolean,
				default: false
			},
			useBeforeRead: {
				// 是否开启读取前的处理函数
				type: Boolean,
				default: false
			},
			beforeRead: {
				// 读取前的处理函数
				type: Function,
				default: null
			},
			useBeforePreview: {
				// 是否开启预览前的处理函数
				type: Boolean,
				default: false
			},
			beforePreview: {
				// 预览前的处理函数
				type: Function,
				default: null
			},
			uploading: {
				// 是否上传中
				type: Boolean,
				default: false
			},
			uploadingText: {
				type: String,
				default: '文件上传中，请稍后再试'
			}
		},
		data() {
			return {
				primaryColor: uni.$u.config.color['u-primary'],
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
				 * name: 文件名
				 * tempFilePath: 临时路径
				 * ext: 文件扩展名
				 */
				previewVideoVis: false,
				previewVideoUrl: '',
				selfUploading: false,	// 上传中 不可选择文件
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
						const name = absList[index].name;
						const extIndex = name.lastIndexOf('.');
						const ext = name.substring(extIndex + 1);	// 扩展名 jpg mp4
						return {
							url: absList[index].url || '',	// 绝对路径
							name,
							path,	// 相对路径 id
							isImage: this.accept === 'image' || uni.$u.test.image(name),
							isVideo: this.accept === 'video' || uni.$u.test.video(name),
							deletable: this.deletable,
							ext
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
				if (this.selfUploading) {
					uni.$u.toast(this.uploadingText);
					return;
				}
				let res;
				switch (this.accept) {
					case 'image':
						res = await chooseImage({ count: this.maxCount - this.lists.length });
						break;
					case 'video':
						res = await chooseVideo({ maxDuration: this.maxDuration });
						break;
					case 'media':
						res = await chooseMedia({ count: this.maxCount - this.lists.length, maxDuration: this.maxDuration });
						break;
					case 'file':
						res = await chooseFile();
						break;
				}
				this.onBeforeRead(res);
				this.onAfterRead(res);
			},
			onBeforeRead(fileArr) {
				// 文件读取之前
				if (this.useBeforeRead && uni.$u.test.func(this.beforeRead)) {
					this.beforeRead(fileArr);
				}
			},
			async onAfterRead(fileArr) {
				const fileListLen = this.lists.length;
				const list = fileArr.map(item => {
					const name = item.name;
					const extIndex = name.lastIndexOf('.');
					const ext = name.substring(extIndex + 1);	// 扩展名 jpg mp4
					return {
						url: item.path,
						name: item.name,
						status: 'uploading',
						message: '上传中',
						isImage: this.accept === 'image' || uni.$u.test.image(item.name || item.thumb),
						isVideo: this.accept === 'video' || uni.$u.test.video(item.name || item.thumb),
						ext
					};
				})
				this.lists.push(...list);
				this.selfUploading = true;
				this.$emit('update:uploading', true);
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
				this.selfUploading = false;
				this.$emit('update:uploading', false);
				this.handleInput();
			},
			deleteItem(index) {
				// 删除图片
				if (this.selfUploading) {
					uni.$u.toast(this.uploadingText);
					return;
				}
				this.lists.splice(index, 1);
				this.handleInput();
			},
			handleInput() {
				this.$emit('input', this.lists.map((item) => (item.path)).filter(Boolean).join(this.separator));
			},
			onPreviewImage(item) {
				// 预览图片
				if (!this.disabled && this.useBeforePreview && uni.$u.test.func(this.beforePreview)) {
					// 预览前处理
					this.beforePreview(item);
					return;
				}
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
				this.previewVideoVis =  true;
				this.previewVideoUrl = item.url;
			},
			onPreviewFile(item) {
				// 预览文件
				const arr = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx'];	// uni.openDocument 支持格式
				if (item.ext && arr.includes(item.ext)) {
					openDocument({ path: item.url });
				} else {
					uni.$u.toast('该文件不支持预览');
				}
			},
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
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: $hf-upload-image-width;
					height: $hf-upload-image-height;
					background-color: $u-bg-color;
					// border: 1px solid rgba($color: $u-border-color, $alpha: 0.3);
					&__text {
						font-size: 10px;
						color: $u-tips-color;
						margin: 2px 4px 0;
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
			background-color: rgba($color: #000008, $alpha: 0.3);
			height: 20px;
			width: 20px;
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
		&__overlay {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			&__video {
				width: 100vw;
				height: calc(100vw *9 / 16);
			}
		}
	}
</style>
