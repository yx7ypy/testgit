<template>
    <div class="content">
        <elmenu></elmenu>
        <div class="right-content">
            <feng-breadcrumb></feng-breadcrumb>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import elmenu from '@/components/navmenu/elmenu.vue'
import fengBreadcrumb from '@/components/fengModule/breadcrumb.vue'

export default {
    data() {
        return {}
    },
    created() {

    },
    computed: {

    },
    components: {
        elmenu,
        fengBreadcrumb
    }
}
</script>
