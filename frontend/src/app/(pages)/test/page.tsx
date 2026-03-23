import FlexCard from '@/app/components/FlexCard'
import React from 'react'
import styles from '@/app/styles/Landing.module.scss'

function Test() {
  return (

    <div>
        <FlexCard width="w-full" flexDir="flex-row" >
            <div className={styles.circleContainer}>
                <div className={styles.test}>
                    Test
                </div>
            </div>
        </FlexCard>
    </div>
  )
}

export default Test