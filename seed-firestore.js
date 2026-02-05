import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();

// Main dashboard data
const mainDashboardData = {
    summary: { total_units: 15194, uk_units: 5553, us_units: 9641, uk_sales: 112409, us_sales: 212030, unique_skus: 10761, unique_devices: 285, unique_designs: 1337 },
    territory: [
        { country: "UK", currency: "GBP", units: 5553, sales: 112409, unique_skus: 4290 },
        { country: "US", currency: "USD", units: 9641, sales: 212030, unique_skus: 6875 }
    ],
    product_types_comparison: [
        { product_type: "HTPCR", UK: 2050, US: 4372, total: 6422 },
        { product_type: "HLBWH", UK: 1301, US: 1000, total: 2301 },
        { product_type: "HC", UK: 704, US: 1028, total: 1732 },
        { product_type: "H8939", UK: 546, US: 732, total: 1278 },
        { product_type: "HDMWH", UK: 426, US: 796, total: 1222 },
        { product_type: "HB401", UK: 163, US: 494, total: 657 },
        { product_type: "FHTPCR", UK: 20, US: 413, total: 433 },
        { product_type: "HB6CR", UK: 114, US: 259, total: 373 },
        { product_type: "HB7BK", UK: 35, US: 150, total: 185 },
        { product_type: "FHC", UK: 9, US: 107, total: 116 }
    ],
    devices_comparison: [
        { device: "IPH16", UK: 240, US: 416, total: 656 },
        { device: "IPH14", UK: 292, US: 342, total: 634 },
        { device: "IPH15", UK: 238, US: 372, total: 610 },
        { device: "IPH17PMAX", UK: 78, US: 528, total: 606 },
        { device: "IPH13", UK: 265, US: 294, total: 559 },
        { device: "IPH17", UK: 123, US: 381, total: 504 },
        { device: "600X300X3", UK: 138, US: 364, total: 502 },
        { device: "IPH12", UK: 233, US: 221, total: 454 },
        { device: "IPHSE4", UK: 108, US: 304, total: 412 },
        { device: "900X400X4", UK: 73, US: 314, total: 387 },
        { device: "IPH16PMAX", UK: 64, US: 321, total: 385 },
        { device: "IPH11", UK: 202, US: 176, total: 378 },
        { device: "IPH17PRO", UK: 64, US: 305, total: 369 },
        { device: "S938U", UK: 128, US: 219, total: 347 },
        { device: "250X300X3", UK: 215, US: 121, total: 336 }
    ],
    design_parents_comparison: [
        { design_parent: "NARUICO", UK: 17, US: 361, total: 378 },
        { design_parent: "PNUTSNF", UK: 84, US: 258, total: 342 },
        { design_parent: "LFCKIT25", UK: 283, US: 23, total: 306 },
        { design_parent: "PNUTBOA", UK: 39, US: 247, total: 286 },
        { design_parent: "PNUTHAL", UK: 47, US: 233, total: 280 },
        { design_parent: "DRGBSUSC", UK: 23, US: 243, total: 266 },
        { design_parent: "HPOTGRA", UK: 31, US: 228, total: 259 },
        { design_parent: "PNUTCHA", UK: 37, US: 221, total: 258 },
        { design_parent: "HPOTDH37", UK: 76, US: 169, total: 245 },
        { design_parent: "AFCKIT25", UK: 156, US: 63, total: 219 },
        { design_parent: "NARUCHA", UK: 7, US: 196, total: 203 },
        { design_parent: "HATSGRA", UK: 23, US: 170, total: 193 },
        { design_parent: "HPOTPRI2", UK: 36, US: 140, total: 176 },
        { design_parent: "PNUTGRA", UK: 22, US: 140, total: 162 },
        { design_parent: "FCBCKT8", UK: 4, US: 151, total: 155 }
    ],
    design_children_comparison: [
        { design_child: "PNUTBOA-XOX", UK: 19, US: 200, total: 219 },
        { design_child: "NARUICO-AKA", UK: 9, US: 174, total: 183 },
        { design_child: "DRGBSUSC-GOK", UK: 10, US: 157, total: 167 },
        { design_child: "LFCKIT25-HOM", UK: 141, US: 10, total: 151 },
        { design_child: "FCBCKT8-AWY", UK: 3, US: 135, total: 138 },
        { design_child: "HPOTDH37-HOP", UK: 31, US: 103, total: 134 },
        { design_child: "PNUTCHA-SNO", UK: 17, US: 117, total: 134 },
        { design_child: "PNUTSNF-CLA", UK: 30, US: 88, total: 118 },
        { design_child: "NCFCCKT-HOM", UK: 114, US: 1, total: 115 },
        { design_child: "PNUTSNF-FUN", UK: 14, US: 95, total: 109 },
        { design_child: "FCBKIT25-HOM", UK: 13, US: 88, total: 101 },
        { design_child: "GMORGRA-ICO", UK: 15, US: 82, total: 97 },
        { design_child: "LFCKIT25-LHOM", UK: 93, US: 1, total: 94 },
        { design_child: "HPOTGRA-MAR", UK: 9, US: 84, total: 93 },
        { design_child: "AFCKIT25-HOM", UK: 58, US: 34, total: 92 }
    ]
};

// Phone case dashboard data
const phoneCaseDashboardData = {
    summary: {
        total_units: 12217,
        uk_units: 4823,
        us_units: 7394,
        uk_sales: 92560,
        us_sales: 160890,
        unique_skus: 8450
    },
    territory: [
        { country: "UK", currency: "GBP", units: 4823, sales: 92560, unique_skus: 3520 },
        { country: "US", currency: "USD", units: 7394, sales: 160890, unique_skus: 5680 }
    ],
    product_types_comparison: [
        { product_type: "HTPCR", UK: 2050, US: 4372, total: 6422, description: "Tough Phone Case Regular" },
        { product_type: "HLBWH", UK: 1301, US: 1000, total: 2301, description: "Leather Book Wallet" },
        { product_type: "HC", UK: 704, US: 1028, total: 1732, description: "Hard Case" },
        { product_type: "HB401", UK: 163, US: 494, total: 657, description: "Hybrid Bumper 401" },
        { product_type: "FHTPCR", UK: 20, US: 413, total: 433, description: "Folio Tough Case" },
        { product_type: "HB6CR", UK: 114, US: 259, total: 373, description: "Hybrid Bumper 6 Clear" },
        { product_type: "HB7BK", UK: 35, US: 150, total: 185, description: "Hybrid Bumper 7 Black" },
        { product_type: "FHC", UK: 9, US: 107, total: 116, description: "Folio Hard Case" },
        { product_type: "HHYBK", UK: 12, US: 45, total: 57, description: "Hybrid Black" }
    ],
    devices_comparison: [
        { device: "IPH16", UK: 240, US: 416, total: 656 },
        { device: "IPH14", UK: 292, US: 342, total: 634 },
        { device: "IPH15", UK: 238, US: 372, total: 610 },
        { device: "IPH17PMAX", UK: 78, US: 528, total: 606 },
        { device: "IPH13", UK: 265, US: 294, total: 559 },
        { device: "IPH17", UK: 123, US: 381, total: 504 },
        { device: "IPH12", UK: 233, US: 221, total: 454 },
        { device: "IPHSE4", UK: 108, US: 304, total: 412 },
        { device: "IPH16PMAX", UK: 64, US: 321, total: 385 },
        { device: "IPH11", UK: 202, US: 176, total: 378 },
        { device: "IPH17PRO", UK: 64, US: 305, total: 369 },
        { device: "S938U", UK: 128, US: 219, total: 347 },
        { device: "S24U", UK: 95, US: 198, total: 293 },
        { device: "S23U", UK: 88, US: 187, total: 275 },
        { device: "PIX9", UK: 45, US: 165, total: 210 }
    ],
    design_parents_comparison: [
        { design_parent: "NARUICO", UK: 17, US: 361, total: 378 },
        { design_parent: "PNUTSNF", UK: 84, US: 258, total: 342 },
        { design_parent: "LFCKIT25", UK: 283, US: 23, total: 306 },
        { design_parent: "PNUTBOA", UK: 39, US: 247, total: 286 },
        { design_parent: "PNUTHAL", UK: 47, US: 233, total: 280 },
        { design_parent: "DRGBSUSC", UK: 23, US: 243, total: 266 },
        { design_parent: "HPOTGRA", UK: 31, US: 228, total: 259 },
        { design_parent: "PNUTCHA", UK: 37, US: 221, total: 258 },
        { design_parent: "HPOTDH37", UK: 76, US: 169, total: 245 },
        { design_parent: "AFCKIT25", UK: 156, US: 63, total: 219 }
    ],
    top_skus: [
        { sku: "HTPCR-IPH16-NARUICO-AKA", UK: 45, US: 189, total: 234 },
        { sku: "HTPCR-IPH17PMAX-PNUTSNF", UK: 32, US: 156, total: 188 },
        { sku: "HTPCR-IPH15-DRGBSUSC-GOK", UK: 28, US: 145, total: 173 },
        { sku: "HC-IPH14-LFCKIT25-HOM", UK: 141, US: 10, total: 151 },
        { sku: "HLBWH-IPH16-HPOTDH37", UK: 67, US: 78, total: 145 },
        { sku: "HTPCR-IPH17-PNUTBOA-XOX", UK: 19, US: 118, total: 137 },
        { sku: "HB401-IPH16PMAX-GMORGRA", UK: 22, US: 98, total: 120 },
        { sku: "HTPCR-S938U-NARUCHA", UK: 15, US: 95, total: 110 }
    ]
};

async function seedFirestore() {
    console.log('Seeding Firestore...');

    try {
        // Seed main dashboard data
        await firestore.collection('dashboards').doc('main').set(mainDashboardData);
        console.log('✓ Main dashboard data seeded');

        // Seed phone case dashboard data
        await firestore.collection('dashboards').doc('phone-cases').set(phoneCaseDashboardData);
        console.log('✓ Phone case dashboard data seeded');

        console.log('\nFirestore seeding complete!');
    } catch (error) {
        console.error('Error seeding Firestore:', error);
        process.exit(1);
    }
}

seedFirestore();
