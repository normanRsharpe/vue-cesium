import type { VNode } from 'vue'
import { defineComponent, getCurrentInstance, ref, computed, nextTick, CSSProperties, watch, reactive, createCommentVNode, h } from 'vue'
import usePosition from '@vue-cesium/composables/private/use-position'
import type { VcCompassEvt, VcBtnTooltipProps, VcComponentInternalInstance, VcReadyObject, VcComponentPublicInstance } from '@vue-cesium/utils/types'
import { $, getVcParentInstance } from '@vue-cesium/utils/private/vm'
import { defaultProps, defaultOptions } from './defaultProps'
import { hMergeSlot } from '@vue-cesium/utils/private/render'
import { VcBtn, VcIcon, VcTooltip } from '@vue-cesium/components/ui'
import type { VcBtnRef } from '@vue-cesium/components/ui'
import { useCommon, useLocale } from '@vue-cesium/composables'
import useCompass from './use-compass'
import { commonEmits } from '@vue-cesium/utils/emits'

const emits = {
  ...commonEmits,
  compassEvt: (evt: VcCompassEvt) => true
}
export const compassProps = defaultProps
export default defineComponent({
  name: 'VcCompass',
  props: compassProps,
  emits: emits,
  setup(props: VcCompassProps, ctx) {
    // state
    const instance = getCurrentInstance() as VcComponentInternalInstance
    instance.cesiumClass = 'VcCompass'
    const commonState = useCommon(props, ctx, instance)
    if (commonState === void 0) {
      return
    }
    const { t } = useLocale()
    const parentInstance = getVcParentInstance(instance)
    const { $services } = commonState
    const compassState = useCompass(props, ctx, instance)
    const positionState = usePosition(props, $services)
    const rootRef = ref<HTMLElement>(null)
    const outerRingRef = ref<VcBtnRef>(null)
    const hasVcNavigation = parentInstance.proxy?.$options.name === 'VcNavigation'
    const canRender = ref(hasVcNavigation)
    const rootStyle = reactive<CSSProperties>({})
    // watch
    watch(
      () => props,
      val => {
        nextTick(() => {
          if (!instance.mounted) {
            return
          }
          updateRootStyle()
        })
      },
      {
        deep: true
      }
    )
    // computed
    const innerOptions = computed(() => {
      return Object.assign({}, defaultOptions.innerOptions, props.innerOptions)
    })
    const outerOptions = computed(() => {
      return Object.assign({}, defaultOptions.outerOptions, props.outerOptions)
    })
    const markerOptions = computed(() => {
      return Object.assign({}, defaultOptions.markerOptions, props.markerOptions)
    })
    const outerCircleStyle = computed(() => {
      return {
        transform: 'translate(-50%,-50%) rotate(-' + compassState.heading.value + 'rad)',
        WebkitTransform: 'translate(-50%,-50%) rotate(-' + compassState.heading.value + 'rad)',
        // transform: 'rotate(-' + heading.value + 'rad)',
        // WebkitTransform: 'rotate(-' + heading.value + 'rad)',
        opacity: undefined,
        background: outerOptions.value.background,
        color: outerOptions.value.color
      }
    })
    const rotationMarkerStyle = computed(() => {
      return {
        transform: 'rotate(-' + compassState.orbitCursorAngle.value + 'rad)',
        WebkitTransform: 'rotate(-' + compassState.orbitCursorAngle.value + 'rad)',
        opacity: compassState.orbitCursorOpacity.value,
        color: markerOptions.value.color
      }
    })
    const innerRingStyle = computed(() => {
      const css: CSSProperties = {
        background: innerOptions.value.background,
        color: innerOptions.value.color
      }
      return css
    })

    // methods
    instance.createCesiumObject = async () => {
      canRender.value = true
      const { viewer } = $services
      return new Promise((resolve, reject) => {
        nextTick(() => {
          if (!hasVcNavigation) {
            const viewerElement = (viewer as any)._element
            viewerElement.appendChild($(rootRef))
            resolve($(rootRef))
          } else {
            resolve($(rootRef))
          }
        })
      })
    }
    instance.mount = async () => {
      updateRootStyle()
      const { viewer } = $services
      viewer.viewerWidgetResized?.raiseEvent({
        type: instance.cesiumClass,
        status: 'mounted',
        target: $(rootRef)
      })
      return compassState.load($services.viewer)
    }
    instance.unmount = async () => {
      const { viewer } = $services
      const viewerElement = (viewer as any)._element
      if (!hasVcNavigation) {
        viewerElement.contains($(rootRef)) && viewerElement.removeChild($(rootRef))
      }
      viewer.viewerWidgetResized?.raiseEvent({
        type: instance.cesiumClass,
        status: 'unmounted',
        target: $(rootRef)
      })
      return compassState.unload()
    }

    const updateRootStyle = () => {
      const css: CSSProperties = positionState.style.value
      rootStyle.left = css.left
      rootStyle.top = css.top
      rootStyle.transform = css.transform
      const side = positionState.attach.value
      const outerRingTarget = $(outerRingRef)?.$el as HTMLElement
      if (outerRingTarget !== void 0) {
        const clientRect = outerRingTarget.getBoundingClientRect()
        css.width = `${clientRect.width}px`
        css.height = `${clientRect.height}px`

        if ((side.bottom || side.top) && !side.left && !side.right) {
          css.left = '50%'
          css.transform = 'translate(-50%, 0)'
        }

        if ((side.left || side.right) && !side.top && !side.bottom) {
          css.top = '50%'
          css.transform = 'translate(0, -50%)'
        }
      }

      Object.assign(rootStyle, css)
    }

    return () => {
      if (canRender.value) {
        let children: Array<VNode> = []
        children = hMergeSlot(ctx.slots.default, children)
        children.push(
          h(
            VcBtn,
            {
              ref: outerRingRef,
              class: 'vc-compass-outerRing absolute-center',
              style: outerCircleStyle.value,
              size: outerOptions.value.size,
              dense: true,
              round: true,
              disabled: !props.enableCompassOuterRing
            },
            () => [
              h(VcIcon, {
                size: outerOptions.value.size,
                name: outerOptions.value.icon
              }),
              outerOptions.value.tooltip
                ? h(
                    VcTooltip,
                    {
                      ref: compassState.iconOuterTooltipRef,
                      ...outerOptions.value.tooltip,
                      onBeforeShow: compassState.onTooltipBeforeShow
                    },
                    () => h('strong', {}, outerOptions.value.tooltip.tip || t('vc.navigation.compass.outerTip'))
                  )
                : createCommentVNode('v-if')
            ]
          )
        )

        children.push(
          h(
            VcBtn,
            {
              class: 'vc-compass-innerRing absolute-center',
              style: innerRingStyle.value,
              size: innerOptions.value.size,
              dense: true,
              round: true
            },
            () => [
              h(VcIcon, {
                size: innerOptions.value.size,
                name: innerOptions.value.icon
              }),
              innerOptions.value.tooltip
                ? h(
                    VcTooltip,
                    {
                      ref: compassState.iconInnerTooltipRef,
                      ...innerOptions.value.tooltip,
                      onBeforeShow: compassState.onTooltipBeforeShow
                    },
                    () => h('strong', {}, innerOptions.value.tooltip.tip || t('vc.navigation.compass.innerTip'))
                  )
                : createCommentVNode('v-if')
            ]
          )
        )

        children.push(
          rotationMarkerStyle.value.opacity
            ? h(
                VcBtn,
                {
                  class: 'vc-compass-rotation-marker absolute-center',
                  dense: true,
                  round: true
                },
                () => [
                  h(VcIcon, {
                    size: markerOptions.value.size,
                    name: markerOptions.value.icon,
                    style: rotationMarkerStyle.value
                  })
                ]
              )
            : createCommentVNode('v-if')
        )

        return h(
          'div',
          {
            ref: rootRef,
            class: 'vc-compass ' + positionState.classes.value,
            style: rootStyle,
            onDblclick: compassState.handleDoubleClick,
            onMousedown: compassState.handleMouseDown,
            onMouseup: compassState.resetRotater,
            onTouchend: compassState.resetRotater,
            onTouchstart: compassState.handleMouseDown
          },
          children
        )
      } else {
        return createCommentVNode('v-if')
      }
    }
  }
})

export type VcCompassEmits = typeof emits
export type VcCompassProps = {
  /**
   * Specify the position of the VcCompass.
   * Default value: top-right
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top' | 'right' | 'bottom' | 'left'
  /**
   * An array of two numbers to offset the VcCompass horizontally and vertically in pixels.
   * Default value: [0, 0]
   */
  offset?: [number, number]
  /**
   * Specify whether the outer ring of the compass can be operated.
   */
  enableCompassOuterRing?: boolean
  /**
   * Specify the flight time to restore the camera, in seconds.
   */
  duration?: number
  /**
   * Specify the parameters of the compass outer ring.
   */
  outerOptions?: VcBtnTooltipProps
  /**
   * Specify the parameters of the inner ring.
   */
  innerOptions?: VcBtnTooltipProps
  /**
   * Specify the parameters of the maker when the compass rotates.
   */
  markerOptions?: VcBtnTooltipProps
  /**
   * Triggers before the VcCompass is loaded.
   */
  onBeforeLoad?: (instance: VcComponentInternalInstance) => void
  /**
   * Triggers when the VcCompass is successfully loaded.
   */
  onReady?: (readyObject: VcReadyObject) => void
  /**
   * Triggers when the VcCompass is destroyed.
   */
  onDestroyed?: (instance: VcComponentInternalInstance) => void
  /**
   * Triggers when the VcCompass is operated.
   */
  onCompassEvt?: (evt: VcCompassEvt) => void
}

export type VcCompassRef = VcComponentPublicInstance<VcCompassProps>
