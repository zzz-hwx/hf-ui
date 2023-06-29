import Schema from '@/uni_modules/uview-ui/libs/util/async-validator.js';
export default {
	props: {
		info: { // 回填的表单数据
			type: Object
		},
		disabled: {	// 是否禁用
			type: Boolean,
			default: false
		}
	},
	watch: {
		info: {
			handler(info) {
				this.setModel(info);
			},
			immediate: true
		}
	},
	computed: {
		labelStyle() {
			if (this.disabled) {
				return {
					color: uni.$u.config.color['u-tips-color']
				};
			}
			return {};
		},
		hasAsyncRule() {
			// 是否有异步校验函数 asyncValidator
			if (!this.rules) return false;
			for (let key in this.rules) {
				const rules = [].concat(this.rules[key]);
				const flag = rules.some(item => (Boolean(item.asyncValidator)));
				if (flag) return true;
			}
			return false;
		}
	},
	mounted() {
		this.$refs.uForm && this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		myValidate() {
			// 自己写的validate
			const uFormItems = this.$refs.uForm.children;
			const rules = {};
			uFormItems.forEach((child) => {
				// 历遍 u-form 所有 u-form-item
				// 过滤掉没有对应表单项的校验规则
				const prop = child.prop;	// 获取对应的属性
				if (this.rules[prop]) {
					rules[prop] = this.rules[prop];
				}
			});
			const validator = new Schema(rules);
			return validator.validate(this.model);
		},
		validate() {
			// 表单校验
			if (this.hasAsyncRule) {
				return this.myValidate().then(() => {
					return this.model;
				}).catch((err) => {
					this.$refs.uForm.validate();
					return Promise.reject(err);
				});
			} else {
				return this.$refs.uForm.validate().then(() => {
					return this.model;
				});
			}
			/**
			 * u-form validateField 逻辑错误
			 * 	没有等异步校验函数asyncValidator执行完再返回, 只是套了一层this.$nextTick, 之后的回调是同步的
			 * 	错误原因:
			 * 		for循环里调用validator.validate, 传入回调函数callback (async-validator的callback为异步调用)
			 * 		for循环结束 执行用户传入的回调函数 (却是同步..)
			 * 		可能...为了解决表单校验的 message 文字..
			 * 
			 * ∴ 组件内重写mixin的validate方法
			 * 直接使用 async-validator 校验
			 * 如果校验失败, 再调一遍u-form的validate, 显示错误信息
			 * 问题: 避免不了...如果验证不通过, 会请求两遍接口...
			 */
		},
		setModel(info) {
			// 设置 this.model
			if (uni.$u.test.object(info)) {
				this.model = {
					...this.model,
					...info
				};
			}
		},
		getModel() {
			// 草稿 直接返回 this.model
			return uni.$u.deepClone(this.model);
		},
		validateField(props) {
			// 对部分表单字段进行校验
			return new Promise((resolve, reject) => {
				this.$refs.uForm.validateField(props, (errorsRes) => {
					if (errorsRes.length) {
						// 表单校验失败
						reject(errorsRes);
					} else {
						resolve(this.model);
					}
				});
			});
		}
	}
}
