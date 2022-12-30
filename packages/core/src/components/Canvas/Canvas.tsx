import * as React from 'react'
import { Brush } from '~components/Brush'
import { Cursor, CursorComponent } from '~components/Cursor'
import { EraseLine } from '~components/EraseLine'
import { Grid } from '~components/Grid'
import { Overlay } from '~components/Overlay'
import { Page } from '~components/Page'
import { SnapLines } from '~components/SnapLines/SnapLines'
import { Users } from '~components/Users'
import { UsersIndicators } from '~components/UsersIndicators'
import {
  useCameraCss,
  useCanvasEvents,
  useKeyEvents,
  usePerformanceCss,
  usePreventNavigationCss,
  useSafariFocusOutFix,
  useZoomEvents,
} from '~hooks'
import { useResizeObserver } from '~hooks/useResizeObserver'
import type {
  TLAssets,
  TLBinding,
  TLBounds,
  TLPage,
  TLPageState,
  TLPerformanceMode,
  TLShape,
  TLSnapLine,
  TLUsers,
} from '~types'

export interface CanvasProps<T extends TLShape, M extends Record<string, unknown>> {
  page: TLPage<T, TLBinding>
  pageState: TLPageState
  assets: TLAssets
  snapLines?: TLSnapLine[]
  eraseLine?: number[][]
  grid?: number
  users?: TLUsers
  userId?: string
  hideBounds: boolean
  hideHandles: boolean
  hideIndicators: boolean
  hideBindingHandles: boolean
  hideCloneHandles: boolean
  hideResizeHandles: boolean
  hideRotateHandle: boolean
  hideGrid: boolean
  showDashedBrush: boolean
  externalContainerRef?: React.RefObject<HTMLElement>
  performanceMode?: TLPerformanceMode
  components?: {
    Cursor?: CursorComponent
  }
  meta?: M
  id?: string
  onBoundsChange: (bounds: TLBounds) => void
  hideCursors?: boolean
}

function _Canvas<T extends TLShape, M extends Record<string, unknown>>({
  id,
  page,
  pageState,
  assets,
  snapLines,
  eraseLine,
  grid,
  users,
  userId,
  components = {},
  meta,
  performanceMode,
  showDashedBrush,
  hideHandles,
  hideBounds,
  hideIndicators,
  hideBindingHandles,
  hideCloneHandles,
  hideResizeHandles,
  hideRotateHandle,
  hideGrid,
  onBoundsChange,
  hideCursors,
}: CanvasProps<T, M>) {
  const rCanvas = React.useRef<HTMLDivElement>(null)

  const rZoomRef = React.useRef(pageState.camera.zoom)

  rZoomRef.current = pageState.camera.zoom

  useZoomEvents(rZoomRef, rCanvas)

  useResizeObserver(rCanvas, onBoundsChange)

  useSafariFocusOutFix()

  usePreventNavigationCss(rCanvas)

  const rContainer = React.useRef<HTMLDivElement>(null)

  const rLayer = React.useRef<HTMLDivElement>(null)

  useCameraCss(rLayer, rContainer, pageState)

  usePerformanceCss(performanceMode, rContainer)

  useKeyEvents()

  const events = useCanvasEvents()

  return (
    <div id={id} className="tl-container" ref={rContainer}>
      <div id="canvas" className="tl-absolute tl-canvas" ref={rCanvas} {...events}>
        {!hideGrid && grid && <Grid grid={grid} camera={pageState.camera} />}
        <div ref={rLayer} className="tl-absolute tl-layer" data-testid="layer">
          <Page
            page={page}
            pageState={pageState}
            assets={assets}
            hideBounds={hideBounds}
            hideIndicators={hideIndicators}
            hideHandles={hideHandles}
            hideBindingHandles={hideBindingHandles}
            hideCloneHandles={hideCloneHandles}
            hideResizeHandles={hideResizeHandles}
            hideRotateHandle={hideRotateHandle}
            meta={meta}
          />
          {users && userId && (
            <UsersIndicators userId={userId} users={users} page={page} meta={meta} />
          )}
          {pageState.brush && (
            <Brush brush={pageState.brush} dashed={showDashedBrush} zoom={pageState.camera.zoom} />
          )}
          {users && !hideCursors && (
            <Users userId={userId} users={users} Cursor={components?.Cursor ?? Cursor} />
          )}
        </div>
        <Overlay camera={pageState.camera}>
          {eraseLine && <EraseLine points={eraseLine} zoom={pageState.camera.zoom} />}
          {snapLines && <SnapLines snapLines={snapLines} />}
        </Overlay>
      </div>
    </div>
  )
}

export const Canvas = React.memo(_Canvas)
