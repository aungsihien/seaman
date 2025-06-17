const express = require('express');
const router = express.Router();

// Department data
const departments = {
    waterways: { key: 'waterways', name: 'ရေကြောင်းဌာနခွဲ', title: 'ရေကြောင်းဌာနခွဲ' },
    engineering: { key: 'engineering', name: 'ရေကြောင်းအင်ဂျင်နီယာဌာနခွဲ', title: 'ရေကြောင်းအင်ဂျင်နီယာဌာနခွဲ' },
    operations: { key: 'operations', name: 'ရေကြောင်းလုပ်ငန်းဌာနခွဲ', title: 'ရေကြောင်းလုပ်ငန်းဌာနခွဲ' },
    seafarer: { key: 'seafarer', name: 'သင်္ဘောသားဌာနခွဲ', title: 'သင်္ဘောသားဌာနခွဲ' },
    sse: { key: 'sse', name: 'SSE ဌာနခွဲ', title: 'SSE ဌာနခွဲ' }
};

// Homepage
router.get('/', (req, res) => {
    res.render('index', { title: 'ပင်မစာမျက်နှာ' });
});

// Department pages
router.get('/department/:deptKey', (req, res) => {
    const deptKey = req.params.deptKey.toLowerCase();
    const department = departments[deptKey];

    if (department) {
        res.render(`department_${department.key}`, { 
            title: department.title + ' - Department Page',
            departmentName: department.name 
        });
    } else {
        res.status(404).render('404', { title: 'Page Not Found' });
    }
});

// Waterways Sub-category Pages
const waterwaysSubSections = {
    'flag-state-survey': { name: 'Flag State Survey(ရေကြောင်း)ဌာနစု', view: 'sub_waterways_flag_state_survey' },
    'examination': { name: 'စာမေးပွဲဌာနစု', view: 'sub_waterways_examination' },
    'training': { name: 'လေ့ကျင့်ရေးဌာနစု', view: 'sub_waterways_training' }
};

router.get('/department/waterways/:subSection', (req, res) => {
    const subKey = req.params.subSection.toLowerCase();
    const subSectionDetails = waterwaysSubSections[subKey];

    if (subSectionDetails) {
        res.render(subSectionDetails.view, {
            title: subSectionDetails.name + ' - ရေကြောင်းဌာနခွဲ',
            subSectionName: subSectionDetails.name,
            parentDepartmentName: departments.waterways.name
        });
    } else {
        res.status(404).render('404', { title: 'Sub-section Not Found' });
    }
});

// Flag State Survey (FSS) Nested Sub-category Pages
const fssNestedSections = {
    'international-vessels': { name: 'အပြည်ပြည်ဆိုင်ရာနှင့် အိမ်နီးချင်းခရီးစဉ်သွားရေယာဉ်', view: 'nested_fss_international_vessels' },
    'coastal-vessels': { name: 'မြန်မာ့ကမ်းရိုးတန်းသွားရေယာဉ်', view: 'nested_fss_coastal_vessels' },
    'insurance-fees': { name: 'အာမခံဆိုင်ရာဝန်ဆောင်ခနှုန်းထားများ', view: 'nested_fss_insurance_fees' },
    'equipment-fees': { name: 'ပစ္စည်းကိရိယာများနှင့်သုတ်ဆေးများ စစ်ဆေးအတည်ပြုဝန်ဆောင်ခနှုန်းထားများ', view: 'nested_fss_equipment_fees' }
};

router.get('/department/waterways/flag-state-survey/:nestedKey', (req, res) => {
    const nestedKey = req.params.nestedKey.toLowerCase();
    const nestedSectionDetails = fssNestedSections[nestedKey];
    const parentSubSectionDetails = waterwaysSubSections['flag-state-survey'];

    if (nestedSectionDetails && parentSubSectionDetails) {
        const renderOptions = {
            title: nestedSectionDetails.name + ' - ' + parentSubSectionDetails.name,
            nestedSectionName: nestedSectionDetails.name,
            parentSubSectionName: parentSubSectionDetails.name,
            grandparentDepartmentName: departments.waterways.name
        };

        // Pass services data specifically for the coastal vessels page to fix ReferenceError
        if (nestedKey === 'coastal-vessels') {
            renderOptions.services = fssIrCoastalServices;
        }

        res.render(nestedSectionDetails.view, renderOptions);
    } else {
        res.status(404).render('404', { title: 'Page Not Found' });
    }
});

// FSS International Vessels - Service Page (e.g., Initial/Renewal/Annual)
const fssIrServices = {
    'initial-renewal-annual': { name: 'ကနဦးစစ်ဆေးခြင်း/သက်တမ်းတိုးခြင်းနှင့်နှစ်ပတ်လည်စစ်ဆေးခြင်း (Initial / Renewal and Annual)', view: 'service_fss_ira' }
};

// FSS Coastal Vessels - Service Page (e.g., Initial/Renewal/Annual)
const fssIrCoastalServices = {
    'initial-renewal-annual': { 
        name: 'ကနဦးစစ်ဆေးခြင်း/သက်တမ်းတိုးခြင်းနှင့် နှစ်ပတ်လည်စစ်ဆေးခြင်း (Initial / Renewal and Annual)', 
        view: 'service_fss_ira_coastal' 
    }
};

const coastalServicesList = [
    { name: 'Cargo Ship Safety Equipment Certificate ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/cargo-ship-safety-equipment-certificate' },
    { name: 'Cargo Ship Safety Radio Certificate ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/cargo-ship-safety-radio-certificate' },
    { name: 'Document of Compliance for Company ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/document-of-compliance-company' },
    { name: 'Domestic Safety Management Certificate ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/domestic-safety-management-certificate' },
    { name: 'Domestic Ship Security Certificate ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/domestic-ship-security-certificate' },
    { name: 'Document of Compliance Special Requirement for Ships carrying Dangerous Good ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/document-of-compliance-special-requirement' },
    { name: 'ခရီးသည်တင် ရေယာဉ်အန္တရာယ်ကင်းရှင်းကြောင်းလက်မှတ်(ခ) Passenger Ship Safety Certificate (B) ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/passenger-ship-safety-certificate-b' },
    { name: 'Safe Manning Certificate ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/safe-manning-certificate' },
    {
        name: 'ပင်လယ်ရေကြောင်းအလုပ်သမားဆိုင်ရာ လက်မှတ် (Maritime Laboure Certificate) ရယူခြင်း',
        url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/maritime-labour-certificate'
    },
    {
        name: 'သင်္ဘောမောင်းဆီယိုဖိတ်မှုအာမခံလက်မှတ် (Bunker Convention Certificate) ရယူခြင်း',
        url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/bunker-convention-certificate'
    },
    { name: 'ဆီယိုဖိတ်မှုအာမခံလက်မှတ် Civil Liability Certificate ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/civil-liability-certificate' },
    {
        name: 'သင်္ဘောသုတ်ဆေးစနစ်များဆိုင်ရာလက်မှတ် (Anti-fouling Certificate) ရယူခြင်း',
        url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/anti-fouling-certificate'
    },
    {
        name: 'Ship Light Weight Certificate ရယူခြင်း',
        url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/ship-light-weight-certificate'
    },
    { name: 'ရေယာဉ်မှတ်ပုံတင်လက်မှတ်ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/vessel-registration-certificate' },
    { name: 'တန်ချိန်လက်မှတ်ရယူခြင်း', url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/tonnage-certificate' },
    { name: 'Life Saving Appliances Certificate ရယူခြင်း', url: '#' },
    {
        name: 'လိုအပ်ချက်အရ ထုတ်ပေးသော အခြားလက်မှတ် ရယူခြင်း',
        url: '/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/other-certificate'
    },
    { name: 'Extension/ Dispensation/ Equivalent/ Exemption letter ရယူခြင်း', url: '#' }
];

router.get('/department/waterways/flag-state-survey/international-vessels/:serviceKey', (req, res) => {
    const serviceKey = req.params.serviceKey.toLowerCase();
    const serviceDetails = fssIrServices[serviceKey];
    const parentNestedSectionDetails = fssNestedSections['international-vessels'];
    const grandparentSubSectionDetails = waterwaysSubSections['flag-state-survey'];

    if (serviceDetails && parentNestedSectionDetails && grandparentSubSectionDetails) {
        res.render(serviceDetails.view, {
            title: serviceDetails.name + ' - ' + parentNestedSectionDetails.name,
            serviceName: serviceDetails.name,
            parentNestedSectionName: parentNestedSectionDetails.name,
            grandparentSubSectionName: grandparentSubSectionDetails.name,
            greatGrandparentDepartmentName: departments.waterways.name
        });
    } else {
        res.status(404).render('404', { title: 'Service Page Not Found' });
    }
});

// FSS IRA - Cargo Ship Safety Equipment Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/cargo-ship-safety-equipment-certificate', (req, res) => {
    const pageTitle = "Cargo Ship Safety Equipment Certificate ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 100000, checked: true },
        { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 50000, checked: false },
        { description: '၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်', price: 50000, checked: false },
        { description: 'သက်တမ်းလွန်ဒဏ်ကြေး', price: 200000, checked: false },
        { description: 'လက်မှတ်ပျောက်ဒဏ်ကြေး', price: 200000, checked: false }
    ];

    res.render('service_fss_ira_cssec', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Cargo Ship Safety Radio Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/cargo-ship-safety-radio-certificate', (req, res) => {
    const pageTitle = "Cargo Ship Safety Radio Certificate ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_cssrc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Document of Compliance for Company Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/document-of-compliance-company', (req, res) => {
    const pageTitle = "Document of Compliance for Company ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_docc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - International Safety Management Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/international-safety-management-certificate', (req, res) => {
    const pageTitle = "International Safety Management Certificate ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_ismc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - International Ship Security Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/international-ship-security-certificate', (req, res) => {
    const pageTitle = "International Ship Security Certificate ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_issc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Document of Compliance Special Requirement for Ships carrying Dangerous Good Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/doc-compliance-dangerous-goods', (req, res) => {
    const pageTitle = "Document of Compliance Special Requirement for Ships carrying Dangerous Good ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_docsrsdg', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Document of Compliance for the carriage of Solid Bulk Cargoes Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/doc-compliance-solid-bulk-cargoes', (req, res) => {
    const pageTitle = "Document of Compliance for the carriage of Solid Bulk Cargoes ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_docsbc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Document of Authorization Approval of Ship's Plans for the carriage of Bulk Grain Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/doc-auth-ship-plans-bulk-grain', (req, res) => {
    const pageTitle = "Document of Authorization Approval of Ship's Plans for the carriage of Bulk Grain ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: false },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_doaspcbg', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Maritime Labour Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/maritime-labour-certificate', (req, res) => {
    const pageTitle = "ပင်လယ်ရေကြောင်းအလုပ်သမားဆိုင်ရာ လက်မှတ် (Maritime Laboure Certificate) ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_mlc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Bunker Convention Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/bunker-convention-certificate', (req, res) => {
    const pageTitle = "သင်္ဘောမောင်းဆီယိုဖိတ်မှုအာမခံလက်မှတ် (Bunker Convention Certificate) ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_bcc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Civil Liability Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/civil-liability-certificate', (req, res) => {
    const pageTitle = "ဆီယိုဖိတ်မှုအာမခံလက်မှတ် Civil Liability Certificate ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_clc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Anti-fouling Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/anti-fouling-certificate', (req, res) => {
    const pageTitle = "သင်္ဘောသုတ်ဆေးစနစ်များဆိုင်ရာလက်မှတ် (Anti-fouling Certificate) ရယူခြင်း";
    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 75000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 30000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 150000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 150000, checked: false }
    ];
    res.render('service_fss_ira_afc', {
        pageTitle,
        items,
        greatGreatGrandparentDepartmentName: 'ရေကြောင်းဌာန',
        greatGrandparentSubSectionName: 'အလံတင်သင်္ဘောစစ်ဆေးရေး',
        grandparentNestedSectionName: 'ကမ်းရိုးတန်းသင်္ဘောများ',
        parentServiceName: 'ကနဦး/သက်တမ်းတိုး/နှစ်စဉ်'
    });
});

// FSS IRA - Other Certificate by Requirement of Convention Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/other-certificate-by-convention-requirement', (req, res) => {
    const pageTitle = "Convention တစ်ခုခု၏လိုအပ်ချက်အရ ထုတ်ပေးသော အခြားလက်မှတ်ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ", price: 50000, checked: false },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 100000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 100000, checked: false }
    ];

    res.render('service_fss_ira_ocrc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Extension/Dispensation/Equivalent/Exemption Letter Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/extension-dispensation-equivalent-exemption-letter', (req, res) => {
    const pageTitle = "Extension/ Dispensation/ Equivalent/ Exemption letter ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "Extension letter", price: 50000, checked: true },
        { description: "Extension စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "Dispensation letter", price: 50000, checked: false },
        { description: "Dispensation စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "Equivalent letter", price: 50000, checked: false },
        { description: "Equivalent စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "Exemption letter", price: 50000, checked: false },
        { description: "Exemption စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false }
    ];

    res.render('service_fss_ira_edeel', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Safe Manning Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/safe-manning-certificate', (req, res) => {
    const pageTitle = "Safe Manning Certificate ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const itemsInternational = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    const itemsNeighboring = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 75000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 50000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 150000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 150000, checked: false }
    ];

    res.render('service_fss_ira_smc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        itemsInternational: itemsInternational,
        itemsNeighboring: itemsNeighboring,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Continuous Synopsis Record Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/continuous-synopsis-record', (req, res) => {
    const pageTitle = "Continuous Synopsis Record ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const usdExchangeRate = 3300; // Placeholder: 1 USD = 3,300 MMK
    const foreignOwnerUsdPrice = 25;
    const foreignOwnerMmkPrice = foreignOwnerUsdPrice * usdExchangeRate;

    const items = [
        {
            description: "နိုင်ငံခြားသားရေယာဉ်ပိုင်ရှင်",
            price: foreignOwnerMmkPrice,
            checked: false,
            isUsdConverted: true,
            originalUsdPrice: foreignOwnerUsdPrice,
            exchangeRate: usdExchangeRate
        },
        { description: "နိုင်ငံသားရေယာဉ်ပိုင်ရှင်", price: 20000, checked: false }
    ];

    res.render('service_fss_ira_csr', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        exchangeRateInfo: {
            usdAmount: foreignOwnerUsdPrice,
            rate: usdExchangeRate
        },
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Vessel Registration Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/vessel-registration-certificate', (req, res) => {
    const pageTitle = "ရေယာဉ်မှတ်ပုံတင်လက်မှတ်ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const tonnageMultiplier = 100;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 100000, checked: false },
        { description: "၅ နှစ်သက်တမ်းမှတ်ပုံတင်လက်မှတ် အသစ်ထပ်မံ ထုတ်ပေးခြင်း", price: 100000, checked: false },
        {
            description: "ရေယာဉ်အသစ်ကနဦးမှတ်ပုံတင်ခြင်း",
            price: null, // Dynamic price, initial value 0, calculated by JS
            checked: false,
            isDynamic: true,
            multiplier: tonnageMultiplier
        },
        {
            description: "ရေယာဉ်ကိုယ်ထည်ပြောင်းလဲမှုကြောင့်ထပ်မံမှတ်ပုံတင်ခြင်း",
            price: null, // Dynamic price, initial value 0, calculated by JS
            checked: false,
            isDynamic: true,
            multiplier: tonnageMultiplier
        },
        { description: "ရေယာဉ်မှတ်ပုံတင်လက်မှတ် မိတ္တူထုတ်ပေးခြင်း", price: 5000, checked: false },
        { description: "၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်", price: 10000, checked: false },
        { description: "နှစ်စဉ်ထပ်ဆင့်ထောက်ခံချက် ပြုလုပ်ရမည့်နေ့ရက် ကျော်လွန်နေခြင်း", price: 75000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 200000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 200000, checked: false }
    ];

    res.render('service_fss_ira_vrc', {
        title: pageTitle + ' - ' + parentServiceName,
        pageTitle: pageTitle,
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Tonnage Certificate Page
router.get('/department/waterways/flag-state-survey/international-vessels/initial-renewal-annual/tonnage-certificate', (req, res) => {
    const pageTitle = "တန်ချိန်လက်မှတ်ရယူခြင်း";
    const parentServiceName = fssIrServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['international-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const tonnageMultiplier = 200;
    const foreignVesselFeeUSD = 100;

    const items = [
        { description: "တန်ချိန်လက်မှတ်ခ", price: 50000, checked: false },
        {
            description: "တန်ချိန်တိုင်းတာ တွက်ချက်ခ(Tonnage Measurement Fees)",
            price: null, // Dynamic price based on tonnage
            checked: false,
            isDynamic: true,
            multiplier: tonnageMultiplier
        },
        {
            description: "နိုင်ငံခြားသားပိုင် ငါးဖမ်းရေယာဉ်များ၏ တန်ချိန်တိုင်းတာ တွက်ချက်ခ",
            price: null, // Dynamic price based on USD exchange rate
            checked: false,
            isDynamic: true,
            isForeignVessel: true,
            usdAmount: foreignVesselFeeUSD
        },
        { description: "နိုင်ငံခြားသားပိုင်ငါးဖမ်းရေယာဉ်များ၏တန်ချိန် ထောက်ခံချက်လက်မှတ်", price: 50000, checked: false },
        { description: "ရေယာဉ်တန်ချိန်လက်မှတ် လက်မှတ်ပျောက်ဆုံးခြင်း", price: 100000, checked: false }
    ];

    res.render('service_fss_ira_tc', {
        title: pageTitle + ' - ' + parentServiceName,
        pageTitle: pageTitle,
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// Coastal Vessels - Initial/Renewal/Annual Services Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual', (req, res) => {
    const pageTitle = fssIrCoastalServices['initial-renewal-annual'].name;
    const parentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;
        res.render('service_fss_ira_coastal', {
        title: pageTitle,
        pageTitle: pageTitle,
        services: coastalServicesList, // Pass the list of services
        parentNestedSectionName: parentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA Coastal - Cargo Ship Safety Equipment Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/cargo-ship-safety-equipment-certificate', (req, res) => {
    const pageTitle = "Cargo Ship Safety Equipment Certificate ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 50000, checked: true },
        { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 30000, checked: false },
        { description: '၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်', price: 30000, checked: false },
        { description: 'သက်တမ်းလွန်ဒဏ်ကြေး', price: 100000, checked: false },
        { description: 'လက်မှတ်ပျောက်ဒဏ်ကြေး', price: 100000, checked: false }
    ];

    res.render('service_fss_ira_coastal_cssec', {
        title: pageTitle + ' - ' + parentServiceName,
        pageTitle: pageTitle,
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA Coastal - Cargo Ship Safety Radio Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/cargo-ship-safety-radio-certificate', (req, res) => {
    const pageTitle = "Cargo Ship Safety Radio Certificate ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 50000, checked: true },
        { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 30000, checked: false },
        { description: '၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်', price: 30000, checked: false },
        { description: 'သက်တမ်းလွန်ဒဏ်ကြေး', price: 100000, checked: false },
        { description: 'လက်မှတ်ပျောက်ဒဏ်ကြေး', price: 100000, checked: false }
    ];

    res.render('service_fss_ira_coastal_cssrc', {
        title: pageTitle + ' - ' + parentServiceName,
        pageTitle: pageTitle,
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA Coastal - Document of Compliance for Company Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/document-of-compliance-company', (req, res) => {
    const pageTitle = "Document of Compliance for Company ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 50000, checked: true },
        { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 30000, checked: false },
        { description: '၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်', price: 30000, checked: false },
        { description: 'သက်တမ်းလွန်ဒဏ်ကြေး', price: 100000, checked: false },
        { description: 'လက်မှတ်ပျောက်ဒဏ်ကြေး', price: 100000, checked: false }
    ];

    res.render('service_fss_ira_coastal_docc', {
        title: pageTitle + ' - ' + parentServiceName,
        pageTitle: pageTitle,
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Domestic Safety Management Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/domestic-safety-management-certificate', (req, res) => {
    const pageTitle = "Domestic Safety Management Certificate ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 50000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 30000, checked: false },
        { description: "၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်", price: 30000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 100000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 100000, checked: false }
    ];

    res.render('service_fss_ira_coastal_dsmc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Domestic Ship Security Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/domestic-ship-security-certificate', (req, res) => {
    const pageTitle = "Domestic Ship Security Certificate ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 50000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 30000, checked: false },
        { description: "၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်", price: 30000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 100000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 100000, checked: false }
    ];

    res.render('service_fss_ira_coastal_dssc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Document of Compliance Special Requirement for Ships carrying Dangerous Good Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/document-of-compliance-special-requirement', (req, res) => {
    const pageTitle = "Document of Compliance Special Requirement for Ships carrying Dangerous Good ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 50000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 30000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 100000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 100000, checked: false }
    ];

    res.render('service_fss_ira_coastal_doccdg', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Passenger Ship Safety Certificate (B) Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/passenger-ship-safety-certificate-b', (req, res) => {
    const pageTitle = "ခရီးသည်တင် ရေယာဉ်အန္တရာယ်ကင်းရှင်းကြောင်းလက်မှတ်(ခ) Passenger Ship Safety Certificate (B) ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 25000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 30000, checked: false }
    ];

    res.render('service_fss_ira_coastal_psscb', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Safe Manning Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/safe-manning-certificate', (req, res) => {
    const pageTitle = "Safe Manning Certificate ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 50000, checked: true },
        { description: "စစ်ဆေးခ(၀၂-၀၁)", price: 30000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 100000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 100000, checked: false }
    ];

    res.render('service_fss_ira_coastal_smc', {
        title: pageTitle + ' - ' + parentServiceName, // For browser tab
        pageTitle: pageTitle, // For H2 on page
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Maritime Labour Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/maritime-labour-certificate', (req, res) => {
    const pageTitle = 'ပင်လယ်ရေကြောင်းအလုပ်သမားဆိုင်ရာ လက်မှတ် (Maritime Laboure Certificate) ရယူခြင်း';
    const items = [
        { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 50000, checked: true },
        { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 30000, checked: false },
        { description: '၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် ကြားကာလထပ်ဆင့် ထောက်ခံချက်', price: 30000, checked: false },
        { description: 'သက်တမ်းလွန်ဒဏ်ကြေး', price: 100000, checked: false },
        { description: 'လက်မှတ်ပျောက်ဒဏ်ကြေး', price: 100000, checked: false }
    ];
    res.render('service_fss_ira_coastal_mlc', {
        pageTitle,
        items,
        greatGreatGrandparentDepartmentName: 'ရေကြောင်းဌာန',
        greatGrandparentSubSectionName: 'အလံတင်သင်္ဘောစစ်ဆေးရေး',
        grandparentNestedSectionName: 'ကမ်းရိုးတန်းသင်္ဘောများ',
        parentServiceName: 'ကနဦး/သက်တမ်းတိုး/နှစ်စဉ်'
    });
});

// FSS IRA Coastal - Bunker Convention Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/bunker-convention-certificate', (req, res) => {
    const pageTitle = 'သင်္ဘောမောင်းဆီယိုဖိတ်မှုအာမခံလက်မှတ် (Bunker Convention Certificate) ရယူခြင်း';
    const items = [
        { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 30000, checked: true },
        { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 30000, checked: false },
        { description: 'သက်တမ်းလွန်ဒဏ်ကြေး', price: 60000, checked: false },
        { description: 'လက်မှတ်ပျောက်ဒဏ်ကြေး', price: 60000, checked: false }
    ];
    res.render('service_fss_ira_coastal_bcc', {
        pageTitle,
        items,
        greatGreatGrandparentDepartmentName: 'ရေကြောင်းဌာန',
        greatGrandparentSubSectionName: 'အလံတင်သင်္ဘောစစ်ဆေးရေး',
        grandparentNestedSectionName: 'ကမ်းရိုးတန်းသင်္ဘောများ',
        parentServiceName: 'ကနဦး/သက်တမ်းတိုး/နှစ်စဉ်'
    });
});

// FSS IRA Coastal - Civil Liability Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/civil-liability-certificate', (req, res) => {
    const pageTitle = 'ဆီယိုဖိတ်မှုအာမခံလက်မှတ် Civil Liability Certificate ရယူခြင်း';
    const items = [
        { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 30000, checked: false },
        { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 30000, checked: false },
        { description: 'သက်တမ်းလွန်ဒဏ်ကြေး', price: 60000, checked: false },
        { description: 'လက်မှတ်ပျောက်ဒဏ်ကြေး', price: 60000, checked: false }
    ];
    res.render('service_fss_ira_coastal_clc', {
        pageTitle,
        items,
        greatGreatGrandparentDepartmentName: 'ရေကြောင်းဌာန',
        greatGrandparentSubSectionName: 'အလံတင်သင်္ဘောစစ်ဆေးရေး',
        grandparentNestedSectionName: 'ကမ်းရိုးတန်းသင်္ဘောများ',
        parentServiceName: 'ကနဦး/သက်တမ်းတိုး/နှစ်စဉ်'
    });
});

// FSS IRA Coastal - Anti-fouling Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/anti-fouling-certificate', (req, res) => {
    const pageTitle = 'သင်္ဘောသုတ်ဆေးစနစ်များဆိုင်ရာလက်မှတ် (Anti-fouling Certificate) ရယူခြင်း';
    const items = [
        { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 75000, checked: true },
        { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 30000, checked: false },
        { description: 'သက်တမ်းလွန်ဒဏ်ကြေး', price: 150000, checked: false },
        { description: 'လက်မှတ်ပျောက်ဒဏ်ကြေး', price: 150000, checked: false }
    ];
    res.render('service_fss_ira_coastal_afc', {
        pageTitle,
        items,
        greatGreatGrandparentDepartmentName: 'ရေကြောင်းဌာန',
        greatGrandparentSubSectionName: 'အလံတင်သင်္ဘောစစ်ဆေးရေး',
        grandparentNestedSectionName: 'ကမ်းရိုးတန်းသင်္ဘောများ',
        parentServiceName: 'ကနဦး/သက်တမ်းတိုး/နှစ်စဉ်'
    });
});

// FSS IRA Coastal - Ship Light Weight Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/ship-light-weight-certificate', (req, res) => {
    res.render('service_fss_ira_coastal_slwc', {
        pageTitle: 'Ship Light Weight Certificate ရယူခြင်း',
        items: [
            { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 15000 },
            { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 30000 }
        ],
        greatGreatGrandparentDepartmentName: 'ရေကြောင်းဌာနခွဲ',
        greatGrandparentSubSectionName: 'အလံတင်သင်္ဘောစစ်ဆေးရေး',
        grandparentNestedSectionName: 'ကမ်းရိုးတန်းသင်္ဘောများ',
        parentServiceName: 'ကနဦး/သက်တမ်းတိုး/နှစ်စဉ်'
    });
});

// Add the new route
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/other-certificate', (req, res) => {
    res.render('service_fss_ira_coastal_other', {
        pageTitle: 'လိုအပ်ချက်အရ ထုတ်ပေးသော အခြားလက်မှတ် ရယူခြင်း',
        items: [
            { description: 'လက်မှတ်ခ(၀၂-၀၉)', price: 30000 },
            { description: 'စစ်ဆေးခ(၀၂-၀၁)', price: 30000 },
            { description: 'သက်တမ်းလွန်ဒဏ်ကြေး', price: 60000 },
            { description: 'လက်မှတ်ပျောက်ဒဏ်ကြေး', price: 60000 }
        ],
        greatGreatGrandparentDepartmentName: 'ရေကြောင်းဌာန',
        greatGrandparentSubSectionName: 'အလံတင်စစ်ဆေးရေးဌာန',
        grandparentNestedSectionName: 'ကမ်းရိုးတန်းသင်္ဘောများ',
        parentServiceName: 'အစပျိုးခြင်း၊ သက်တမ်းတိုးခြင်းနှင့် နှစ်စဉ်စစ်ဆေးခြင်း',
        formatCurrency: (amount) => {
            const myanmarNumbers = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
            const numStr = amount.toLocaleString('en-US');
            const myanmarStr = numStr.split('').map(char => {
                if (char === ',') return ',';
                if (char >= '0' && char <= '9') return myanmarNumbers[parseInt(char)];
                return char;
            }).join('');
            return myanmarStr + ' ကျပ်';
        }
    });
});

// FSS IRA - Coastal Vessel Registration Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/vessel-registration-certificate', (req, res) => {
    const pageTitle = "ရေယာဉ်မှတ်ပုံတင်လက်မှတ်ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const tonnageMultiplier = 100;

    const items = [
        { description: "လက်မှတ်ခ(၀၂-၀၉)", price: 50000, checked: false },
        {
            description: "ရေယာဉ်အသစ်ကနဦးမှတ်ပုံတင်ခြင်း",
            price: null, // Dynamic price based on tonnage
            checked: false,
            isDynamic: true,
            multiplier: tonnageMultiplier
        },
        {
            description: "ရေယာဉ်ကိုယ်ထည်ပြောင်းလဲမှုကြောင့်ထပ်မံမှတ်ပုံတင်ခြင်း",
            price: null, // Dynamic price based on tonnage
            checked: false,
            isDynamic: true,
            multiplier: tonnageMultiplier
        },
        { description: "ရေယာဉ်မှတ်ပုံတင်လက်မှတ် မိတ္တူထုတ်ပေးခြင်း", price: 5000, checked: false },
        { description: "၅ နှစ်သက်တမ်းရှိ လက်မှတ်တွင် နှစ်စဉ်ထပ်ဆင့် ထောက်ခံချက်", price: 10000, checked: false },
        { description: "နှစ်စဉ်ထပ်ဆင့်ထောက်ခံချက် ပြုလုပ်ရမည့်နေ့ရက် ကျော်လွန်နေခြင်း", price: 75000, checked: false },
        { description: "သက်တမ်းလွန်ဒဏ်ကြေး", price: 100000, checked: false },
        { description: "လက်မှတ်ပျောက်ဒဏ်ကြေး", price: 100000, checked: false }
    ];

    res.render('service_fss_ira_coastal_vrc', {
        title: pageTitle + ' - ' + parentServiceName,
        pageTitle: pageTitle,
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

// FSS IRA - Coastal Tonnage Certificate Page
router.get('/department/waterways/flag-state-survey/coastal-vessels/initial-renewal-annual/tonnage-certificate', (req, res) => {
    const pageTitle = "တန်ချိန်လက်မှတ်ရယူခြင်း";
    const parentServiceName = fssIrCoastalServices['initial-renewal-annual'].name;
    const grandparentNestedSectionName = fssNestedSections['coastal-vessels'].name;
    const greatGrandparentSubSectionName = waterwaysSubSections['flag-state-survey'].name;
    const greatGreatGrandparentDepartmentName = departments.waterways.name;

    const tonnageMultiplier = 200;
    const foreignVesselFeeUSD = 100;

    const items = [
        { description: "တန်ချိန်လက်မှတ်ခ", price: 50000, checked: false },
        {
            description: "တန်ချိန်တိုင်းတာ တွက်ချက်ခ(Tonnage Measurement Fees)",
            price: null, // Dynamic price based on tonnage
            checked: false,
            isDynamic: true,
            multiplier: tonnageMultiplier
        },
        {
            description: "နိုင်ငံခြားသားပိုင် ငါးဖမ်းရေယာဉ်များ၏ တန်ချိန်တိုင်းတာ တွက်ချက်ခ",
            price: null, // Dynamic price based on USD exchange rate
            checked: false,
            isDynamic: true,
            isForeignVessel: true,
            usdAmount: foreignVesselFeeUSD
        },
        { description: "နိုင်ငံခြားသားပိုင်ငါးဖမ်းရေယာဉ်များ၏တန်ချိန် ထောက်ခံချက်လက်မှတ်", price: 50000, checked: false },
        { description: "ရေယာဉ်တန်ချိန်လက်မှတ် လက်မှတ်ပျောက်ဆုံးခြင်း", price: 100000, checked: false }
    ];

    res.render('service_fss_ira_coastal_tonnage', {
        title: pageTitle + ' - ' + parentServiceName,
        pageTitle: pageTitle,
        items: items,
        parentServiceName: parentServiceName,
        grandparentNestedSectionName: grandparentNestedSectionName,
        greatGrandparentSubSectionName: greatGrandparentSubSectionName,
        greatGreatGrandparentDepartmentName: greatGreatGrandparentDepartmentName
    });
});

module.exports = router;
