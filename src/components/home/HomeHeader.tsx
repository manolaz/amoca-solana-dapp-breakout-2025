import React from 'react';
import { Box } from '@radix-ui/themes';
import { HomeSection } from '../HomeSection';

export function HomeHeader() {
    return (
        <>
            {/* AMOCA Mascot */}
            <Box
                as="img"
                src="/BLUE/a2.svg"
                alt="AMOCA Climate Guardian"
                style={{ display: 'block', margin: '16px auto', width: 150, height: 'auto' }}
            />
            <HomeSection />
        </>
    );
}
