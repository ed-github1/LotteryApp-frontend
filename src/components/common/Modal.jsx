import React, { useState } from 'react'
import useMeasure from 'react-use-measure'
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion
} from 'framer-motion'

export const DragCloseDrawerExample = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="">
      <button
        onClick={() => setOpen(true)}
        className="font-white bg-blue-500 w-full"
      >
        Open drawer
      </button>

      <DragCloseDrawer open={open} setOpen={setOpen}>
        <div className="how-to-play">
          <ol className="font-thin">
            <li>
              <h3 className="font-secondary font-black">Select Your Numbers</h3>
              <p>
                Once you're logged in, go to the "Lottery" section. You can
                choose your numbers manually or opt for the “Quick Pick”
                feature, which randomly selects numbers for you. Select the
                number of tickets you want to purchase.
              </p>
            </li>

            <li>
              <h3 className="font-secondary font-bold">Choose Your Draw</h3>
              <p>
                You can either enter a single draw or subscribe to multiple
                upcoming draws. Each draw will have its own deadline, so make
                sure to purchase your tickets before the countdown ends.
              </p>
            </li>

            <li>
              <h3 className="font-secondary font-bold">Payment</h3>
              <p>
                After selecting your numbers and the draw, proceed to the
                payment section. You can pay using the available methods such as
                credit/debit cards, e-wallets, or other supported payment
                gateways.
              </p>
            </li>

            <li>
              <h3 className="font-secondary font-bold">Wait for the Draw</h3>
              <p>
                After completing the payment, your ticket is valid for the next
                draw. The app will notify you when the draw is taking place, so
                you can watch the results live or check them afterward.
              </p>
            </li>

            <li>
              <h3 className="font-secondary font-bold">Check Results</h3>
              <p>
                After the draw, you can check the results in the app's "Results"
                section. If your numbers match the winning combination,
                congratulations! You’ve won a prize!
              </p>
            </li>

            <li>
              <h3 className="font-secondary font-bold">Claim Your Prize</h3>
              <p>
                If you're a winner, you will be notified by the app. Prizes can
                be claimed directly through the app, and you'll receive them via
                your selected payout method (bank transfer, digital wallet,
                etc.).
              </p>
            </li>

            <li>
              <h3 className="font-secondary font-bold">Play Responsibly</h3>
              <p>
                Always remember to play responsibly. Set limits for yourself,
                and avoid excessive spending. If you feel that your playing is
                becoming problematic, seek help through the app’s responsible
                gaming resources.
              </p>
            </li>
          </ol>
        </div>
      </DragCloseDrawer>
    </div>
  )
}

const DragCloseDrawer = ({ open, setOpen, children }) => {
  const [scope, animate] = useAnimate()
  const [drawerRef, { height }] = useMeasure()

  const y = useMotionValue(0)
  const controls = useDragControls()

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0]
    })

    const yStart = typeof y.get() === 'number' ? y.get() : 0

    await animate('#drawer', {
      y: [yStart, height]
    })

    setOpen(false)
  }

  return (
    <>
      {open && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-neutral-950/70"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{
              ease: 'easeInOut'
            }}
            className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-white"
            style={{ y }}
            drag="y"
            dragControls={controls}
            onDragEnd={() => {
              if (y.get() >= 100) {
                handleClose()
              }
            }}
            dragListener={false}
            dragConstraints={{
              top: 0,
              bottom: 0
            }}
            dragElastic={{
              top: 0,
              bottom: 0.5
            }}
          >
            <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-neutral-900 p-4">
              <button
                onPointerDown={(e) => {
                  controls.start(e)
                }}
                className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
              ></button>
            </div>
            <div className="relative z-0 h-full overflow-y-scroll p-4 pt-12">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
