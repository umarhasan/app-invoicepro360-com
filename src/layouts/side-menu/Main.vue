<template>
  <div>
    <SideMenuContent />
    <MobileMenu />
    <div class="flex">
      
      <!-- BEGIN: Side Menu -->
      <nav v-if="!isSetup" class="side-nav"
      :class="{
        'side-nav--simple': isCollapsed,
      }" >
        <!-- BEGIN: Logo 
        <a href="javascript:;" class="intro-x flex items-center justify-center py-2 border-b">
          <img src="../../assets/images/invoice-logo.png" alt="Invoice360Pro" class="dash-logos" />
        </a>-->
        <ul>
          <li v-for="index in 5" :key="index" class="skeleton-item">
            <a href="" class="side-menu py-5">
              <div class="skeleton-icon side-menu__icon rounded-full"></div>
              <div class="skeleton-title side-menu__title rounded-full"></div>
            </a>
          </li>
        </ul>
      </nav>

      <nav v-if="isSetup" class="side-nav border-r"
      :class="{
        'side-nav--simple': isCollapsed,
      }" >
        <div class="side-nav-inner">
        <!-- BEGIN: Logo 
        <a href="javascript:;" class="intro-x flex items-center justify-center py-2">
          <img src="../../assets/images/invoice-logo.png" alt="Invoice360Pro" class="dash-logo" />
        </a>
         END: Logo -->
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <li
              v-if="menu == 'devider'"
              :key="menu + menuKey"
              class="side-nav__devider my-6 hidden"
            ></li>
            <li v-else :key="menu + menuKey">
              <SideMenuTooltip
                :isCollapsed="isCollapsed"
                tag="a"
                :content="menu.title"
                href="javascript:;"
                class="side-menu"
                :class="{
                  'side-menu--active': menu.active,
                  'side-menu--open': menu.activeDropdown,
                }"
                :options="{
                        placement: 'left'
                      }"
                @click="linkTo(menu, router)"
              >
                <div class="side-menu__icon">
                  <Lucide :icon="menu.icon" />
                </div>
                <div class="side-menu__title">
                  {{ menu.title }}
                  <div
                    v-if="menu.subMenu"
                    class="side-menu__sub-icon"
                    :class="{ 'transform rotate-180': menu.activeDropdown }"
                  >
                    <Lucide icon="ChevronDown" />
                  </div>
                </div>
              </SideMenuTooltip>
              <!-- BEGIN: Second Child -->
              <transition @enter="enter" @leave="leave">
                <ul v-if="menu.subMenu && menu.activeDropdown">
                  <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
                    <SideMenuTooltip 
                    :isCollapsed="isCollapsed"
                      tag="a"
                      :content="subMenu.title"
                      :options="{
                        placement: 'left'
                      }"
                      href="javascript:;"
                      class="side-menu"
                      :class="{
                        'side-menu--active': subMenu.active,
                      }"
                      @click="linkTo(subMenu, router)"
                    >
                      <div class="side-menu__icon">
                        <Lucide :icon="subMenu.icon" />
                      </div>
                      <div class="side-menu__title">
                        {{ subMenu.title }}
                        <div
                          v-if="subMenu.subMenu"
                          class="side-menu__sub-icon"
                          :class="{
                            'transform rotate-180': subMenu.activeDropdown,
                          }"
                        >
                          <Lucide icon="ChevronDown" />
                        </div>
                      </div>
                    </SideMenuTooltip>
                    <!-- BEGIN: Third Child -->
                    <transition @enter="enter" @leave="leave">
                      <ul v-if="subMenu.subMenu && subMenu.activeDropdown">
                        <li
                          v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                          :key="lastSubMenuKey"
                        >
                          <SideMenuTooltip
                            tag="a"
                            :isCollapsed="isCollapsed"
                            :content="lastSubMenu.title"
                            :options="{
                              placement: 'left'
                            }"
                            href="javascript:;"
                            class="side-menu"
                            :class="{
                              'side-menu--active': lastSubMenu.active,
                            }"
                            @click="linkTo(lastSubMenu, router)"
                          >
                            <div class="side-menu__icon">
                              <Lucide icon="Zap" />
                            </div>
                            <div class="side-menu__title">
                              {{ lastSubMenu.title }}
                            </div>
                          </SideMenuTooltip>
                        </li>
                      </ul>
                    </transition>
                    <!-- END: Third Child -->
                  </li>
                </ul>
              </transition>
              <!-- END: Second Child -->
            </li>
          </template>
          <!-- END: First Child -->
        </ul>
        </div>
        <div class="side-collapse" @click="collapseMainMenu()">
          <span class="text">Collapse</span>
          <span class="icon" 
          :class="{
            'rotate-180  ': isCollapsed,
          }">
            <svg data-v-14c8c335="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-from-line lucide-icon customizable w-[15px]"><path d="m9 6-6 6 6 6"></path><path d="M3 12h14"></path><path d="M21 19V5"></path></svg>
          </span>
        </div>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <app-skeleton v-if="!isSetup && !isDashboard"></app-skeleton>
      
      <div class="content">
        
        <div class="px-5">
          <router-view v-if="isSetup || isDashboard" />
        </div>
      </div>

      <!-- END: Content -->
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { helper as $h } from "@/utils/helper";
import MobileMenu from "@/components/mobile-menu/Main.vue";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main.vue";
import { linkTo, nestedMenu, enter, leave } from "@/layouts/side-menu/index.js";
import { useUtils } from "@/compositions/utils";
import AppSkeleton from "@/layouts/side-menu/AppSkeleton.vue";
import cash from "cash-dom"

export default defineComponent({
  components: {
    MobileMenu,
    SideMenuTooltip,
    AppSkeleton,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { isSetup, menuItems } = useUtils();
    const formattedMenu = ref([]);
    const sideMenu = computed(() => nestedMenu(menuItems.value, route));
    const showModalBox = ref(false);
    const isDashboard = ref(false);
    const isCollapsed = ref(false);

    if (route.path == "/dashboard") isDashboard.value = true;

    watch(
      () => {
        return isSetup.value;
      },
      () => {
        sideMenu.value = computed(() => nestedMenu(menuItems.value, route));
        formattedMenu.value = $h.toRaw(sideMenu.value);
      }
    );

    onMounted(() => {
      cash("body").removeClass("error-page").removeClass("login").addClass("main");
      formattedMenu.value = $h.toRaw(sideMenu.value);
      //toggleTooltip();
    });

    const closeModalBox = () => {
      showModalBox.value = false;
    };

    const collapseMainMenu = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    return {
      formattedMenu,
      router,
      linkTo,
      enter,
      leave,
      showModalBox,
      closeModalBox,
      isSetup,
      isDashboard,
      collapseMainMenu,
      isCollapsed
    };
  },
});
</script>

<style scoped>
.skeleton-item .skeleton-icon {
  width: 30px;
  height: 30px;
  animation: pulse-bg 1s infinite;
}

.skeleton-item .skeleton-title {
  height: 16px;
  width: 75% !important;
  animation: pulse-bg 1s infinite;
}

@keyframes pulse-bg {
  0% {
    background-color: #eeeeee;
  }
  50% {
    background-color: #eeeeee;
  }
  100% {
    background-color: #eeeeee;
  }
}
</style>