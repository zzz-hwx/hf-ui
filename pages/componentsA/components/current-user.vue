<!-- 子组件 <current-user>-->
<template>
	<view>
		<view v-for="(item, index) in user" :key="index">
			<!-- <slot name="item" :user="item">{{item.lastName}}</slot> -->
			<template v-if="$slots.item">
				<slot name="item" :user="item"></slot>
			</template>
			<template v-else>
				{{item.lastName}}
			</template>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				user: [{
					"lastName": "bar",
					"firstName": "foo-item"
				}, {
					"lastName": "bar",
					"firstName": "foo-222"
				}]
			}
		}
	}
</script>