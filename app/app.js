
var appData = {
  mode: '',
  common: {
    toAddress: '',
    cardHolderName: '',
    date: '',
    designation: '',
    placeOfPosting: 'New Delhi',
    // NEW FIELDS ↓
    dgehsCardNo: '',
    basicPay: '',
    cardPlaceOfIssue: '',
    validityFrom: '',
    validityTo: 'TILL RETIREMENT',
    wardEntitlement: '',
    fullAddress: '',
    telephoneOffice: '',
    telephoneMobile: '',
    email: '',
    bankName: '',
    bankBranch: '',
    bankAccountNo: '',
    micrCode: '',
    ifscCode: '',
    bankTelephone: '',
    hospitalNames: '',
    opdTreatmentFrom: '',
    opdTreatmentTo: '',
    indoorAdmissionDate: '',
    indoorDischargeDate: ''
  },
  patients: [],
  singleAnnexureChoice: '3',
  combinedA3: false
};


var STORAGE_KEY = 'dgehs_reimbursement_data';

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function showScreen(id) {
  $$('.screen').forEach(function(s) { s.classList.remove('active'); });
  var el = document.getElementById(id);
  if (el) el.classList.add('active');
  setTimeout(function() { if (window.lucide) lucide.createIcons(); }, 50);
}

function formatDateDMY(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}


function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return String(d.getDate()).padStart(2, '0') + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + d.getFullYear();
}

function validateRequiredFields(fields) {
  var firstInvalid = null;
  fields.forEach(function(f) {
    var el = document.getElementById(f.id);
    if (!el) return;
    var existingErr = document.getElementById(f.id + '-error');
    if (existingErr) existingErr.remove();
    el.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
    var value = (el.value || '').trim();
    if (!value) {
      el.classList.add('border-red-500', 'ring-2', 'ring-red-500');
      var errMsg = document.createElement('p');
      errMsg.id = f.id + '-error';
      errMsg.className = 'text-red-500 text-xs mt-1';
      errMsg.textContent = f.label + ' is required.';
      el.insertAdjacentElement('afterend', errMsg);
      if (!firstInvalid) firstInvalid = el;
    }
  });
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid.focus();
    return false;
  }
  return true;
}

function numberToWords(num) {
  if (num === 0 || num === '' || isNaN(num)) return 'Zero Only';
  num = parseInt(num, 10);
  if (num < 0) return 'Negative ' + numberToWords(Math.abs(num));
  var ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  var tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
  }
  var result = [];
  var crore = Math.floor(num / 10000000);
  var lakh = Math.floor((num % 10000000) / 100000);
  var thousand = Math.floor((num % 100000) / 1000);
  var remainder = num % 1000;
  if (crore > 0) result.push(convert(crore) + ' Crore');
  if (lakh > 0) result.push(convert(lakh) + ' Lakh');
  if (thousand > 0) result.push(convert(thousand) + ' Thousand');
  if (remainder > 0) result.push(convert(remainder));
  return result.join(' ') + ' Only';
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    var status = document.getElementById('save-status');
    if (status) {
      status.style.opacity = '1';
      setTimeout(function() { status.style.opacity = '0'; }, 2000);
    }
  } catch (e) { console.warn('Storage save failed', e); }
}

function loadFromStorage() {
  try {
    var data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      var parsed = JSON.parse(data);
      if (parsed.common) appData.common = parsed.common;
      if (parsed.mode) appData.mode = parsed.mode;
      if (parsed.patients) appData.patients = parsed.patients;
      if (parsed.singleAnnexureChoice) appData.singleAnnexureChoice = parsed.singleAnnexureChoice;
      if (parsed.combinedA3 !== undefined) appData.combinedA3 = parsed.combinedA3;  
      return true;
    }
  } catch (e) { console.warn('Storage load failed', e); }
  return false;
}



function scrollToCommonDetails() {
        const section = document.getElementById('common-details-section');
        const headerHeight = 65;

        if (!section) return;

        const sectionPosition = section.getBoundingClientRect().top;
        const offsetPosition = sectionPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }



function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}





function populateSetupFromData() {
  var map = {
    'to-address': 'toAddress',
    'card-holder-name': 'cardHolderName',
    'claim-date': 'date',
    'designation': 'designation',
    'place-of-posting': 'placeOfPosting',
    'dgehs-card-no': 'dgehsCardNo',
    'basic-pay': 'basicPay',
    'card-place-issue': 'cardPlaceOfIssue',
    'validity-from': 'validityFrom',
    'validity-to': 'validityTo',
    'ward-entitlement': 'wardEntitlement',
    'full-address': 'fullAddress',
    'telephone-office': 'telephoneOffice',
    'telephone-mobile': 'telephoneMobile',
    'email-address': 'email',
    'bank-name': 'bankName',
    'bank-branch': 'bankBranch',
    'bank-account': 'bankAccountNo',
    'micr-code': 'micrCode',
    'ifsc-code': 'ifscCode',
    'bank-telephone': 'bankTelephone',
    'hospital-names': 'hospitalNames',
    'opd-treatment-from': 'opdTreatmentFrom',
    'opd-treatment-to': 'opdTreatmentTo',
    'indoor-admission-date': 'indoorAdmissionDate',
    'indoor-discharge-date': 'indoorDischargeDate'

  };
  for (var id in map) {
    var el = document.getElementById(id);
    if (el) el.value = appData.common[map[id]] || '';
  }
}

var app = {
  init: function() {
    var hadData = loadFromStorage();
    populateSetupFromData();
    if (hadData && appData.common.cardHolderName) {
      var status = document.getElementById('save-status');
      if (status) {
        status.querySelector('span').textContent = 'Previous data loaded from browser storage';
        status.style.opacity = '1';
        setTimeout(function() { status.style.opacity = '0'; }, 3000);
      }
    }
    lucide.createIcons();
  },

    saveDraft: function() {
    var to = document.getElementById('to-address').value.trim();
    var name = document.getElementById('card-holder-name').value.trim();
    var date = document.getElementById('claim-date').value;
    var desig = document.getElementById('designation').value.trim();
    var place = document.getElementById('place-of-posting').value.trim();
    
    appData.common = {
      toAddress: to, cardHolderName: name, date: date, designation: desig, placeOfPosting: place,
      basicPay: document.getElementById('basic-pay').value.trim(),
      dgehsCardNo: document.getElementById('dgehs-card-no').value.trim(),
      cardPlaceOfIssue: document.getElementById('card-place-issue').value.trim(),
      validityFrom: document.getElementById('validity-from').value,
      validityTo: document.getElementById('validity-to').value,
      wardEntitlement: document.getElementById('ward-entitlement').value,
      fullAddress: document.getElementById('full-address').value.trim(),
      telephoneOffice: document.getElementById('telephone-office').value.trim(),
      telephoneMobile: document.getElementById('telephone-mobile').value.trim(),
      email: document.getElementById('email-address').value.trim(),
      bankName: document.getElementById('bank-name').value.trim(),
      bankBranch: document.getElementById('bank-branch').value.trim(),
      bankAccountNo: document.getElementById('bank-account').value.trim(),
      micrCode: document.getElementById('micr-code').value.trim(),
      ifscCode: document.getElementById('ifsc-code').value.trim(),
      bankTelephone: document.getElementById('bank-telephone').value.trim(),
      opdTreatmentFrom: document.getElementById('opd-treatment-from').value,
      hospitalNames: document.getElementById('hospital-names').value.trim(),
      opdTreatmentTo: document.getElementById('opd-treatment-to').value,
      indoorAdmissionDate: document.getElementById('indoor-admission-date').value,
      indoorDischargeDate: document.getElementById('indoor-discharge-date').value
    };
    saveToStorage();
    
    var status = document.getElementById('save-status');
    if (status) {
      status.querySelector('span').textContent = 'Draft saved!';
      status.style.opacity = '1';
      setTimeout(function() { status.style.opacity = '0'; }, 2000);
    }
  },


    fitA4: function() {
    var a4HeightPx = 1123; // ~297mm at 96dpi
    $$('.annexure-sheet').forEach(function(sheet) {
      var contentH = sheet.scrollHeight;
      if (contentH > a4HeightPx) {
        var scale = (a4HeightPx - 10) / contentH;
        sheet.style.transform = 'scale(' + scale.toFixed(4) + ')';
      } else {
        sheet.style.transform = 'none';
      }
    });
  },

  getA2Amount: function() {
  var billTotal = this.calculatePatientTotal(0);
  if (appData.common.a2UseOverride && appData.common.a2AmountOverride) {
    return parseFloat(appData.common.a2AmountOverride) || billTotal;
  }
  return billTotal;
},

  

    exportData: function() {
    var dataStr = JSON.stringify(appData, null, 2);
    var blob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'dgehs_claim_backup_' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importData: function(input) {
    var file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert('This file is too large to be a valid backup (max 2MB). Import cancelled.');
    input.value = '';
    return;
  }
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var parsed = JSON.parse(e.target.result);

        var isValidShape = parsed && typeof parsed === 'object' &&
        parsed.common && typeof parsed.common === 'object' && !Array.isArray(parsed.common) &&
        Array.isArray(parsed.patients) && parsed.patients.length > 0 && parsed.patients.length <= 10;
      if (!isValidShape) {
        alert('Invalid backup file. Please select a valid DGEHS export.');
        return;
      }
        if (!parsed.common || !parsed.patients) {
          alert('Invalid backup file. Please select a valid DGEHS export.');
          return;
        }
        if (confirm('This will replace all current data with the backup. Continue?')) {
          appData = parsed;
          if (appData.singleAnnexureChoice === undefined) appData.singleAnnexureChoice = '3';
          if (appData.combinedA3 === undefined) appData.combinedA3 = false;
          saveToStorage();
          populateSetupFromData();
          
          // Show success
          var status = document.getElementById('save-status');
          if (status) {
            status.querySelector('span').textContent = 'Backup restored successfully!';
            status.style.opacity = '1';
            setTimeout(function() { status.style.opacity = '0'; }, 3000);
          }
        }
      } catch (err) {
        alert('Could not read file. Make sure it is a valid .json export.');
      }
      input.value = '';
    };
    reader.readAsText(file);
  },

  toggleCombinedA3: function() {
    appData.combinedA3 = document.getElementById('combined-a3-toggle').checked;
    saveToStorage();
  },
  goToSetup: function() {
    populateSetupFromData();
    showScreen('setup-screen');
  },
    saveSetup: function() {
    var to = document.getElementById('to-address').value.trim();
    var name = document.getElementById('card-holder-name').value.trim();
    var date = document.getElementById('claim-date').value;
    var desig = document.getElementById('designation').value.trim();
    var place = document.getElementById('place-of-posting').value.trim();
    
    var requiredFields = [
  { id: 'to-address', label: 'To (School / Office Address)' },
  { id: 'designation', label: 'Designation' },
  { id: 'place-of-posting', label: 'Place of Posting' },
  { id: 'card-holder-name', label: 'DGEHS Card Holder Name' },
  { id: 'claim-date', label: 'Date' },
  { id: 'dgehs-card-no', label: 'DGEHS Card No.' },
  { id: 'bank-account', label: 'Bank Account No.' },
  { id: 'ifsc-code', label: 'IFSC Code' }
    ];
      if (!validateRequiredFields(requiredFields)) {
        return;
      }
    
    appData.common = {
      toAddress: to,
      cardHolderName: name,
      date: date,
      designation: desig,
      placeOfPosting: place,
      basicPay: document.getElementById('basic-pay').value.trim(),
      dgehsCardNo: document.getElementById('dgehs-card-no').value.trim(),
      cardPlaceOfIssue: document.getElementById('card-place-issue').value.trim(),
      validityFrom: document.getElementById('validity-from').value,
      validityTo: document.getElementById('validity-to').value,
      wardEntitlement: document.getElementById('ward-entitlement').value,
      fullAddress: document.getElementById('full-address').value.trim(),
      telephoneOffice: document.getElementById('telephone-office').value.trim(),
      telephoneMobile: document.getElementById('telephone-mobile').value.trim(),
      email: document.getElementById('email-address').value.trim(),
      bankName: document.getElementById('bank-name').value.trim(),
      bankBranch: document.getElementById('bank-branch').value.trim(),
      bankAccountNo: document.getElementById('bank-account').value.trim(),
      micrCode: document.getElementById('micr-code').value.trim(),
      ifscCode: document.getElementById('ifsc-code').value.trim(),
      bankTelephone: document.getElementById('bank-telephone').value.trim(),
      opdTreatmentFrom: document.getElementById('opd-treatment-from').value,
      hospitalNames: document.getElementById('hospital-names').value.trim(),
      opdTreatmentTo: document.getElementById('opd-treatment-to').value,
      indoorAdmissionDate: document.getElementById('indoor-admission-date').value,
      indoorDischargeDate: document.getElementById('indoor-discharge-date').value

    };
    saveToStorage();
    showScreen('home-screen');
  },
  goToHome: function() { showScreen('home-screen'); },
  selectMode: function(mode) {
    appData.mode = mode;
    if (!appData.patients.length || appData.patients.length === 0) appData.patients = [];
    saveToStorage();
    this.renderPatientScreen();
    showScreen('patient-screen');
  },
  clearStorage: function() {
    if (confirm('Clear all saved data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      appData = { mode: '', common: { toAddress:'', cardHolderName:'', date:'', designation:'', placeOfPosting:'New Delhi' }, patients: [], singleAnnexureChoice: '3', combinedA3: false };
      document.querySelectorAll('input, textarea').forEach(function(el) { el.value = ''; });
      document.getElementById('place-of-posting').value = 'New Delhi';
      var status = document.getElementById('save-status');
      if (status) { status.querySelector('span').textContent = 'All saved data cleared'; status.style.opacity = '1'; setTimeout(function() { status.style.opacity = '0'; }, 3000); }
    }
  },
  renderPatientScreen: function() {
    var single = document.getElementById('single-patient-block');
    var multi = document.getElementById('multiple-patient-block');
    if (appData.mode === 'single') {
      single.style.display = 'block'; multi.style.display = 'none';
      if (appData.patients.length > 0) document.getElementById('single-patient-name').value = appData.patients[0].name;
    } else {
      single.style.display = 'none'; multi.style.display = 'block';
      if (appData.patients.length === 0) this.addPatient();
      else this.renderPatientList();
    }
  },
  renderPatientList: function() {
    var container = document.getElementById('patient-list');
    var html = '';
    appData.patients.forEach(function(p, i) {
      html += '<div class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">' +
        '<div class="flex-shrink-0 w-8 h-8 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center text-sm font-bold">' + (i+1) + '</div>' +
        '<div class="flex-1 min-w-0">' +
          '<label class="block text-xs font-medium text-slate-500 mb-1">Patient Name</label>' +
          '<input type="text" class="multi-patient-name w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" data-idx="' + i + '" value="' + escapeHtml(p.name) + '" placeholder="Enter patient name Eg. Kunal(son)">' +
        '</div>' +
        '<button class="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors" onclick="app.removePatient(' + i + ')" title="Remove">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
        '</button>' +
      '</div>';
    });
    container.innerHTML = html;
  },




goHome: function() {
  // Reset current claim data but keep common details
  appData.mode = '';
  appData.patients = [];
  appData.singleAnnexureChoice = '3';
  saveToStorage();
  showScreen('home-screen');
},
  addPatient: function() {
    if (appData.patients.length >= 10) { alert('Maximum 10 patients allowed.'); return; }
    $$('.multi-patient-name').forEach(function(el) {
      var idx = parseInt(el.dataset.idx, 10);
      if (appData.patients[idx]) appData.patients[idx].name = el.value.trim();
    });
    appData.patients.push({ name: '', bills: [{hospital:'',billNo:'',date:'',amount:'',pageBill:'',pagePrescription:'',pageTestReport:''}], diagnosis: '' });
    saveToStorage(); this.renderPatientList();
  },
  removePatient: function(idx) {
    if (appData.patients.length <= 1) { alert('At least one patient is required.'); return; }
    $$('.multi-patient-name').forEach(function(el) {
      var i = parseInt(el.dataset.idx, 10);
      if (appData.patients[i]) appData.patients[i].name = el.value.trim();
    });
    appData.patients.splice(idx, 1);
    saveToStorage(); this.renderPatientList();
  },
  savePatients: function() {
    if (appData.mode === 'single') {
      var name = document.getElementById('single-patient-name').value.trim();
      if (!name) { alert('Please enter patient name.'); return; }
      appData.patients = [{ name: name, bills: [{hospital:'',billNo:'',date:'',amount:'',pageBill:'',pagePrescription:'',pageTestReport:''}], diagnosis: '' }];
      saveToStorage(); showScreen('annexure-choice-screen');
    } else {
      $$('.multi-patient-name').forEach(function(el) {
        var i = parseInt(el.dataset.idx, 10);
        if (appData.patients[i]) appData.patients[i].name = el.value.trim();
      });
      var valid = true;
      appData.patients.forEach(function(p) { if (!p.name) valid = false; });
      if (!valid) { alert('Please fill all patient names.'); return; }
      saveToStorage(); this.renderAnnexure3Fill(); showScreen('annexure3-fill-screen');
    }
  },
  goToPatients: function() { this.renderPatientScreen(); showScreen('patient-screen'); },
  selectAnnexure: function(choice) {
  appData.singleAnnexureChoice = choice; saveToStorage();
  if (choice === '3') { this.renderAnnexure3Fill(); showScreen('annexure3-fill-screen'); }
  else { this.renderDirectAnnexure2(); showScreen('annexure2-direct-screen'); }
},
  goToAnnexureChoice: function() { showScreen('annexure-choice-screen'); },
  goBackFromA3: function() {
    if (appData.mode === 'single') showScreen('annexure-choice-screen');
    else showScreen('patient-screen');
  },
  renderAnnexure3Fill: function() {
    var tabsEl = document.getElementById('a3-tabs');
    var panelsEl = document.getElementById('a3-panels');
    var toggle = document.getElementById('combined-a3-toggle');
    if (toggle) toggle.checked = appData.combinedA3;
    var tabs = '', panels = '';
    appData.patients.forEach(function(p, i) {
      var label = appData.mode === 'single' ? 'Bills' : (p.name || 'Patient ' + (i+1));
      tabs += '<button class="patient-tab px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ' + (i===0 ? 'bg-primary-600 text-white border-primary-600' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200 hover:text-slate-800') + '" onclick="app.switchTab(' + i + ')" data-tab="' + i + '">' + label + '</button>';
      var billRows = app.renderBills(i);
      panels += '<div class="patient-panel ' + (i===0 ? 'active' : '') + '" id="panel-' + i + '" style="display:' + (i===0 ? 'block' : 'none') + '">' +
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">' +
          '<div><label class="block text-xs font-semibold text-slate-500 mb-1">NAME OF PATIENT</label><input type="text" class="a3-patient-name w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" data-idx="' + i + '" value="' + escapeHtml(p.name) + '"></div>' +
          '<div><label class="block text-xs font-semibold text-slate-500 mb-1">Diagnosis / Procedure</label><input type="text" class="a3-diagnosis w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" data-idx="' + i + '" value="' + escapeHtml(p.diagnosis) + '" placeholder="Enter diagnosis"></div>' +
        '</div>' +
        '<div class="table-scroll overflow-x-auto">' +
        '<table class="w-full border-collapse text-sm">' +
        '<thead><tr class="bg-slate-100 text-slate-700"><th rowspan="2" class="border border-slate-300 px-2 py-2 font-semibold text-xs">#</th><th rowspan="2" class="border border-slate-300 px-2 py-2 font-semibold text-xs min-w-[160px]">Hospital / Lab / Pharmacy</th><th rowspan="2" class="border border-slate-300 px-2 py-2 font-semibold text-xs">Bill No.</th><th rowspan="2" class="border border-slate-300 px-2 py-2 font-semibold text-xs">Dated</th><th rowspan="2" class="border border-slate-300 px-2 py-2 font-semibold text-xs">Amount</th><th rowspan="2" class="border border-slate-300 px-2 py-2 font-semibold text-xs min-w-[90px]">Treatment</th><th rowspan="2" class="border border-slate-300 px-2 py-2 font-semibold text-xs min-w-[120px]">Category</th><th colspan="3" class="border border-slate-300 px-2 py-2 font-semibold text-xs">Page No. From&ndash;To</th><th rowspan="2" class="border border-slate-300 px-2 py-2 font-semibold text-xs no-print"></th></tr>' +
        '<tr class="bg-slate-100 text-slate-700"><th class="border border-slate-300 px-2 py-1 font-semibold text-xs">Bill</th><th class="border border-slate-300 px-2 py-1 font-semibold text-xs">Presc.</th><th class="border border-slate-300 px-2 py-1 font-semibold text-xs">Report</th></tr></thead>' +
        '<tbody id="bills-body-' + i + '">' + billRows + '</tbody>' +
        '<tfoot><tr class="bg-slate-50 font-bold text-slate-800"><td colspan="4" class="border border-slate-300 px-3 py-2 text-right">TOTAL</td><td id="total-' + i + '" class="border border-slate-300 px-3 py-2 text-right">0.00</td><td colspan="6" class="border border-slate-300 px-3 py-2"></td></tr></tfoot>' +
        '</table></div>' +
        '<button class="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-xl hover:bg-primary-100 transition-colors no-print" onclick="app.addBill(' + i + ')">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>' +
          'Add Bill' +
        '</button>' +
      '</div>';
    });
    tabsEl.innerHTML = tabs;
    panelsEl.innerHTML = panels;
    appData.patients.forEach(function(p, i) { app.calcTotal(i); });
  },
  renderBills: function(pIdx) {
    var p = appData.patients[pIdx];
    var html = '';
    if (!p.bills || !p.bills.length) p.bills = [{hospital:'',billNo:'',date:'',amount:'',type:'OPD',category:'Consultation',pageBill:'',pagePrescription:'',pageTestReport:''}];
    p.bills.forEach(function(b, i) {
      html += '<tr class="hover:bg-slate-50 transition-colors">' +
        '<td class="border border-slate-300 px-2 py-2 text-center text-slate-600">' + (i+1) + '</td>' +
        '<td class="border border-slate-300 px-2 py-2"><input type="text" class="bill-hospital w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all" data-p="' + pIdx + '" data-b="' + i + '" value="' + escapeHtml(b.hospital) + '" placeholder="Hospital name"></td>' +
        '<td class="border border-slate-300 px-2 py-2"><input type="text" class="bill-no w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-center" data-p="' + pIdx + '" data-b="' + i + '" value="' + escapeHtml(b.billNo) + '"></td>' +
        '<td class="border border-slate-300 px-2 py-2"><input type="date" class="bill-date w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-center" data-p="' + pIdx + '" data-b="' + i + '" value="' + escapeHtml(b.date) + '" placeholder="DD/MM/YY"></td>' +
        '<td class="border border-slate-300 px-2 py-2"><input type="number" class="bill-amt w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-right" data-p="' + pIdx + '" data-b="' + i + '" value="' + escapeHtml(b.amount) + '" onchange="app.calcTotal(' + pIdx + ')"></td>' +
        '<td class="border border-slate-300 px-2 py-2"><select class="bill-type min-w-[80px] w-full px-1 py-1 bg-white border border-slate-200 rounded text-sm" data-p="' + pIdx + '" data-b="' + i + '">' +
          '<option value="OPD"' + ((b.type || 'OPD') === 'OPD' ? ' selected' : '') + '>OPD</option>' +
          '<option value="Indoor"' + (b.type === 'Indoor' ? ' selected' : '') + '>Indoor</option>' +
        '</select></td>' +
        '<td class="border border-slate-300 px-2 py-2"><select class="bill-category min-w-[110px] w-full px-1 py-1 bg-white border border-slate-200 rounded text-sm" data-p="' + pIdx + '" data-b="' + i + '">' +
          '<option value="Consultation"' + ((b.category || 'Consultation') === 'Consultation' ? ' selected' : '') + '>Consultation</option>' +
          '<option value="Medicine"' + (b.category === 'Medicine' ? ' selected' : '') + '>Medicine</option>' +
          '<option value="Investigation"' + (b.category === 'Investigation' ? ' selected' : '') + '>Investigation</option>' +
          '<option value="Other"' + (b.category === 'Other' ? ' selected' : '') + '>Other</option>' +
        '</select></td>' +
        '<td class="border border-slate-300 px-2 py-2"><input type="text" class="bill-pb w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-center" data-p="' + pIdx + '" data-b="' + i + '" value="' + escapeHtml(b.pageBill) + '"></td>' +
        '<td class="border border-slate-300 px-2 py-2"><input type="text" class="bill-pp w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-center" data-p="' + pIdx + '" data-b="' + i + '" value="' + escapeHtml(b.pagePrescription) + '"></td>' +
        '<td class="border border-slate-300 px-2 py-2"><input type="text" class="bill-pt w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-center" data-p="' + pIdx + '" data-b="' + i + '" value="' + escapeHtml(b.pageTestReport) + '"></td>' +
        '<td class="border border-slate-300 px-2 py-2 text-center no-print"><button onclick="app.removeBill(' + pIdx + ',' + i + ')" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors" title="Remove"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button></td>' +
      '</tr>';
    });
    return html;
  },
  switchTab: function(idx) {
    $$('.patient-tab').forEach(function(t, i) {
      if (i === idx) {
        t.classList.remove('bg-slate-100', 'text-slate-600', 'border-transparent');
        t.classList.add('bg-primary-600', 'text-white', 'border-primary-600');
      } else {
        t.classList.remove('bg-primary-600', 'text-white', 'border-primary-600');
        t.classList.add('bg-slate-100', 'text-slate-600', 'border-transparent');
      }
    });
    $$('.patient-panel').forEach(function(p) { p.style.display = 'none'; });
    var panel = document.getElementById('panel-' + idx);
    if (panel) panel.style.display = 'block';
  },
  addBill: function(pIdx) {
    this.saveBillsForPatient(pIdx);
    appData.patients[pIdx].bills.push({hospital:'',billNo:'',date:'',amount:'',type:'OPD',category:'Consultation',pageBill:'',pagePrescription:'',pageTestReport:''});
    saveToStorage();
    document.getElementById('bills-body-' + pIdx).innerHTML = this.renderBills(pIdx);
    this.calcTotal(pIdx);
  },
  removeBill: function(pIdx, bIdx) {
    if (appData.patients[pIdx].bills.length <= 1) { alert('At least one bill row is required.'); return; }
    this.saveBillsForPatient(pIdx);
    appData.patients[pIdx].bills.splice(bIdx, 1);
    saveToStorage();
    document.getElementById('bills-body-' + pIdx).innerHTML = this.renderBills(pIdx);
    this.calcTotal(pIdx);
  },
  saveBillsForPatient: function(pIdx) {
    var bills = [];
    var rows = document.querySelectorAll('#bills-body-' + pIdx + ' tr');
    rows.forEach(function(row) {
      bills.push({
        hospital: row.querySelector('.bill-hospital') ? row.querySelector('.bill-hospital').value : '',
        billNo: row.querySelector('.bill-no') ? row.querySelector('.bill-no').value : '',
        date: row.querySelector('.bill-date') ? row.querySelector('.bill-date').value : '',
        amount: row.querySelector('.bill-amt') ? row.querySelector('.bill-amt').value : '',
        type: row.querySelector('.bill-type') ? row.querySelector('.bill-type').value : 'OPD',
        category: row.querySelector('.bill-category') ? row.querySelector('.bill-category').value : 'Consultation',
        pageBill: row.querySelector('.bill-pb') ? row.querySelector('.bill-pb').value : '',
        pagePrescription: row.querySelector('.bill-pp') ? row.querySelector('.bill-pp').value : '',
        pageTestReport: row.querySelector('.bill-pt') ? row.querySelector('.bill-pt').value : ''
      });
    });
    appData.patients[pIdx].bills = bills;
  },
  calcTotal: function(pIdx) {
    var total = 0;
    var amts = document.querySelectorAll('#bills-body-' + pIdx + ' .bill-amt');
    amts.forEach(function(el) { total += parseFloat(el.value) || 0; });
    var totalEl = document.getElementById('total-' + pIdx);
    if (totalEl) totalEl.textContent = total.toFixed(2);
  },
  saveA3Data: function() {
    var self = this;
    appData.patients.forEach(function(p, i) {
      var nameEl = document.querySelector('.a3-patient-name[data-idx="' + i + '"]');
      var diagEl = document.querySelector('.a3-diagnosis[data-idx="' + i + '"]');
      if (nameEl) p.name = nameEl.value || p.name;
      if (diagEl) p.diagnosis = diagEl.value || '';
      self.saveBillsForPatient(i);
    });
    saveToStorage();
  },
  calculatePatientTotal: function(idx) {
    var total = 0;
    appData.patients[idx].bills.forEach(function(b) { total += parseFloat(b.amount) || 0; });
    return total;
  },
  calculateAnnexureIITotals: function() {
    var totals = {
      OPD: { Consultation: 0, Medicine: 0, Investigation: 0, Other: 0 },
      Indoor: { Consultation: 0, Medicine: 0, Investigation: 0, Other: 0 }
    };
    appData.patients.forEach(function(p) {
      (p.bills || []).forEach(function(b) {
        var type = b.type === 'Indoor' ? 'Indoor' : 'OPD';
        var category = totals[type].hasOwnProperty(b.category) ? b.category : 'Other';
        var amount = parseFloat(b.amount) || 0;
        totals[type][category] += amount;
      });
    });
    return totals;
  },
  generateOutput: function() {
    this.saveA3Data();
    if (appData.mode === 'single') { this.renderSingleOutput(); showScreen('output-single-screen'); }
    else { this.renderMultipleOutput(); showScreen('output-multiple-screen'); }
  },
   renderSingleOutput: function() {
  var p = appData.patients[0];
  var total = this.calculatePatientTotal(0);
  var words = numberToWords(total);
  var html = '';
  
  html += this.buildAnnexureIModifiedChecklist();
  html += this.buildAnnexureIIReimbursementForm(p, total, this.calculateAnnexureIITotals());
  
  html += this.buildAnnexure3Sheet(0);

  if (appData.common.a2Filled) {
    html += this.buildAnnexure2SheetFromSaved();
  } else {
    html += this.buildAnnexure2Sheet(p, total, words);
  }
  
  document.getElementById('single-output-container').innerHTML = html;
   this.fitA4();
},
  renderMultipleOutput: function() {
    var grandTotal = 0, rows = '';
    appData.patients.forEach(function(p, i) {
      var t = app.calculatePatientTotal(i);
      grandTotal += t;
      rows += '<tr><td>' + (i+1) + '</td><td>' + p.name + '</td><td>' + escapeHtml(p.diagnosis) + '</td><td>' + t.toFixed(2) + '</td><td></td></tr>';
    });
    var words = numberToWords(grandTotal);
    var html = '';


    // These two lines must be present:
    html += this.buildAnnexureIModifiedChecklist();
    html += this.buildAnnexureIIReimbursementForm(appData.patients[0], grandTotal, this.calculateAnnexureIITotals());

    html += this.buildAnnexure1Sheet(rows, grandTotal, words);
    
    if (appData.combinedA3) {
      html += this.buildCombinedAnnexure3Sheet();
    } else {
      appData.patients.forEach(function(p, i) {
        html += app.buildAnnexure3Sheet(i);
      });
    }
    
    document.getElementById('multiple-output-container').innerHTML = html;
    this.fitA4();
  },
  buildAnnexure3Sheet: function(idx) {
    var p = appData.patients[idx];
    var total = this.calculatePatientTotal(idx);
    var rows = '';
    p.bills.forEach(function(b, i) {
      rows += '<tr><td>' + (i+1) + '</td><td class="left">' + escapeHtml(b.hospital) + '</td><td>' + escapeHtml(b.billNo) + '</td><td>' + (formatDateDMY(b.date) || '') + '</td><td>' + (parseFloat(b.amount) || 0).toFixed(2) + '</td><td>' + escapeHtml(b.pageBill) + '</td><td>' + escapeHtml(b.pagePrescription) + '</td><td>' + escapeHtml(b.pageTestReport) + '</td></tr>';
    });
    return '<div class="annexure-sheet">' +
      '<div class="annexure-number">Annexure 3</div>' +
      '<div class="annexure-title">CHECK LIST OF BILLS / VOUCHERS</div>' +
      '<div style="margin:15px 0;"><strong>NAME OF PATIENT</strong> <span style="border-bottom:1px solid #000; display:inline-block; min-width:300px; padding-left:10px;">' + p.name + '</span></div>' +
      '<table class="form-table newformat"><thead><tr><th rowspan="2">#</th><th rowspan="2">Name of Hospital/Health Center/Laboratory/imaging center/pharmacy</th><th rowspan="2">Bill No.</th><th rowspan="2">Dated</th><th rowspan="2">Amount (Rupees)</th><th colspan="3">At page no. From--To</th></tr><tr><th>Bill</th><th>Prescription</th><th>Test report</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '<tfoot><tr style="font-weight:bold;"><td colspan="4" style="text-align:right;">TOTAL</td><td>' + total.toFixed(2) + '</td><td colspan="3"></td></tr></tfoot>' +
      '</table>' +
      '<div class="signature-area"><div class="signature-left"></div><div class="signature-right"><div>Signature of DGEHS Card Holder <span class="sig-line"></span></div><div>Name of DGEHS Card Holder <strong>' + escapeHtml(appData.common.cardHolderName) + '</strong></div><div>Designation <strong>' + escapeHtml(appData.common.designation) + '</strong></div><div>Place of Posting <strong>' + escapeHtml(appData.common.placeOfPosting) + '</strong></div></div></div>' +
    '</div>';
  },

    buildCombinedAnnexure3Sheet: function() {
    var grandTotal = 0;
    var allRows = '';
    var rowNum = 1;
    
    appData.patients.forEach(function(p, pi) {
      var pTotal = app.calculatePatientTotal(pi);
      grandTotal += pTotal;
      
      // Patient header row
      allRows += '<tr style="background:#f5f5f5;font-weight:bold;"><td colspan="8" class="left" style="padding:6px 8px;">Patient: ' + p.name + (p.diagnosis ? ' &mdash; ' + p.diagnosis : '') + ' &nbsp; (Total: ' + pTotal.toFixed(2) + ')</td></tr>';
      
      p.bills.forEach(function(b, bi) {
        allRows += '<tr>' +
          '<td>' + rowNum + '</td>' +
          '<td class="left">' + escapeHtml(b.hospital) + '</td>' +
          '<td>' + escapeHtml(b.billNo) + '</td>' +
          '<td>' + (formatDateDMY(b.date) || '') + '</td>' +
          '<td>' + (parseFloat(b.amount) || 0).toFixed(2) + '</td>' +
          '<td>' + escapeHtml(b.pageBill) + '</td>' +
          '<td>' + escapeHtml(b.pagePrescription) + '</td>' +
          '<td>' + escapeHtml(b.pageTestReport) + '</td>' +
        '</tr>';
        rowNum++;
      });
    });
    
    return '<div class="annexure-sheet">' +
      '<div class="annexure-number">Annexure 3</div>' +
      '<div class="annexure-title">CHECK LIST OF BILLS / VOUCHERS</div>' +
      '<div style="margin:10px 0;font-weight:bold;">Patients: ' + appData.patients.map(function(p){ return escapeHtml(p.name); }).join(', ') + '</div>' +
      '<table class="form-table newformat">' +
      '<thead><tr><th rowspan="2">#</th><th rowspan="2">Name of Hospital/Health Center/Laboratory/imaging center/pharmacy</th><th rowspan="2">Bill No.</th><th rowspan="2">Dated</th><th rowspan="2">Amount (Rupees)</th><th colspan="3">At page no. From--To</th></tr>' +
      '<tr><th>Bill</th><th>Prescription</th><th>Test report</th></tr></thead>' +
      '<tbody>' + allRows + '</tbody>' +
      '<tfoot><tr style="font-weight:bold;"><td colspan="4" style="text-align:right;">GRAND TOTAL</td><td>' + grandTotal.toFixed(2) + '</td><td colspan="3"></td></tr></tfoot>' +
      '</table>' +
      '<div class="signature-area"><div class="signature-left"></div><div class="signature-right"><div>Signature of DGEHS Card Holder <span class="sig-line"></span></div><div>Name of DGEHS Card Holder <strong>' + escapeHtml(appData.common.cardHolderName) + '</strong></div><div>Designation <strong>' + escapeHtml(appData.common.designation) + '</strong></div><div>Place of Posting <strong>' + escapeHtml(appData.common.placeOfPosting) + '</strong></div></div></div>' +
    '</div>';
  },

  buildAnnexure2Sheet: function(p, total, words) {
    var encRows = '';
    var encs = ['Duly filled modified checklist for reimbursement of medical claim.','Duly filled Revised Medical 2004 Form for reimbursement.','Photocopy of DGEHS card,','Details of all bills/ vouchers (as per annexure)-','All bills in original','All prescriptions and/or discharge summaries.','All reports of Investigations','Essentiality Certificate','Self-Explanatory Note'];
    encs.forEach(function(e, i) { encRows += '<tr><td>' + (i+1) + '</td><td class="left">' + e + '</td><td></td></tr>'; });
    return '<div class="annexure-sheet">' +
      '<div class="annexure-number">Annexure - 2</div>' +
      '<div class="annexure-title">COVERING LETTER OF MEDICAL REIMBURSEMENT CLAIMS</div>' +
      '<div class="annexure-subtitle">(For Single claim)</div>' +
      '<div style="margin-bottom:15px;"><div>To</div><div style="margin-left:30px;white-space:pre-line;">' + escapeHtml(appData.common.toAddress) + '</div></div>' +
      '<div style="margin-bottom:15px;"><strong>Subject :-</strong> Submission of Medical Bills for reimbursement in R/o <strong>' + escapeHtml(appData.common.cardHolderName) + '</strong></div>' +
      '<div style="margin-bottom:15px;">Respected Sir/Madam,<br><br>&nbsp;&nbsp;&nbsp;&nbsp;With reference to the subject cited above find enclosed here with Medical Bills amounting to <strong>Rs. ' + total.toFixed(2) + '/-</strong> as detailed below:</div>' +
      '<div style="margin-bottom:10px;font-style:italic;text-decoration:underline;">Enclosures:</div>' +
      '<table class="form-table newformat"><thead><tr><th>#</th><th style="text-align:left;">PARTICULARS</th><th>Page No.<br>From--To</th></tr></thead><tbody>' + encRows + '</tbody></table>' +
      '<div style="margin-top:20px;margin-bottom:20px;">You are requested to release the amount <strong>Rs. ' + total.toFixed(2) + '/-</strong><br>(Rupees <strong>' + words + '</strong>) as soon as possible and oblige me.</div>' +
      '<div class="signature-area"><div class="signature-left"><div>Dated: <span style="border-bottom:1px solid #000;display:inline-block;width:120px;">' + formatDateDMY(escapeHtml(appData.common.date)) + '</span></div><div>Place:- ' + escapeHtml(appData.common.placeOfPosting) + '</div></div>' +
      '<div class="signature-right"><div>Thanking you,</div><div style="margin-top:40px;">Yours Sincerely</div><div style="margin-top:30px;"><div>Signature of DGEHS Card Holder <span class="sig-line"></span></div><div>Name of DGEHS Card Holder <strong>' + escapeHtml(appData.common.cardHolderName) + '</strong></div><div>Designation <strong>' + escapeHtml(appData.common.designation) + '</strong></div><div>Place of Posting <strong>' + escapeHtml(appData.common.placeOfPosting) + '</strong></div></div></div></div>' +
    '</div>';
  },
  buildAnnexure1Sheet: function(rows, grandTotal, words) {
    return '<div class="annexure-sheet">' +
      '<div class="annexure-number">Annexure - 1</div>' +
      '<div class="annexure-title">COVERING LETTER OF MEDICAL REIMBURSEMENT CLAIMS</div>' +
      '<div class="annexure-subtitle">(More than One claim)</div>' +
      '<div style="margin-bottom:15px;"><div>To</div><div style="margin-left:30px;white-space:pre-line;">' + escapeHtml(appData.common.toAddress) + '</div></div>' +
      '<div style="margin-bottom:15px;"><strong>Subject :-</strong> Submission of Medical Bills for reimbursement in R/o ' + escapeHtml(appData.common.cardHolderName) + '</div>' +
      '<div style="margin-bottom:15px;">Respected Sir/Madam,<br><br>&nbsp;&nbsp;&nbsp;&nbsp;Please find enclosed here with Medical Bills amounting to <strong>Rs. ' + grandTotal.toFixed(2) + '/-</strong> as detailed below:-</div>' +
      '<table class="form-table newformat"><thead><tr><th>#</th><th>Name of Patient</th><th>Diagnosis / Procedure</th><th>Amount (Rs)</th><th>Page Nos.<br>From__To</th></tr></thead>' +
      '<tbody>' + rows + '<tr style="font-weight:bold;"><td colspan="3" style="text-align:right;">Total</td><td>' + grandTotal.toFixed(2) + '</td><td></td></tr></tbody>' +
      '</table>' +
      '<div style="margin-top:20px;margin-bottom:20px;">You are requested to release the amount <strong>Rs. ' + grandTotal.toFixed(2) + '/-</strong><br>(Rupees <strong>' + words + '</strong>) as soon as possible and oblige me.</div>' +
      '<div class="signature-area"><div class="signature-left"><div>Dated: <span style="border-bottom:1px solid #000;display:inline-block;width:120px;">' + formatDateDMY(escapeHtml(appData.common.date)) + '</span></div><div>Place: ' + escapeHtml(appData.common.placeOfPosting) + '</div></div>' +
      '<div class="signature-right"><div>Thanking you,</div><div style="margin-top:40px;">Yours Sincerely</div><div style="margin-top:30px;"><div>Signature of DGEHS Card Holder <span class="sig-line"></span></div><div>Name of DGEHS Card Holder <strong>' + escapeHtml(appData.common.cardHolderName) + '</strong></div><div>Designation <strong>' + escapeHtml(appData.common.designation) + '</strong></div><div>Place of Posting <strong>' + escapeHtml(appData.common.placeOfPosting) + '</strong></div></div></div></div>' +
    '</div>';
  },
  buildAnnexureIModifiedChecklist: function() {
    var c = appData.common;
    var docs = [
      { label: 'a) Revised Medical 2004 Form', key: 'docA' },
      { label: 'b) Photocopy of DGEHS Card showing validity (Emp./Patient)', key: 'docB' },
      { label: 'c) Photocopy of Referral/Authorization form AMA', key: 'docC' },
      { label: 'd) Original Bills', key: 'docD' },
      { label: 'e) Copy of prescription for OPD cases / Discharge Summary for Indoor cases', key: 'docE' },
      { label: 'f) Breakup for Lab Investigation', key: 'docF' },
      { label: 'g) Breakup of Drugs prescribed', key: 'docG' },
      { label: 'h) Emergency Certificate from Hospital Empanelled/Registered (Emergency Admission)', key: 'docH' },
      { label: 'i) Self explanatory letter showing need of emergency visit', key: 'docI' },
      { label: 'j) Non Availability Certificate from AMA for drugs prescribed in OPD', key: 'docJ' },
      { label: 'k) Original papers lost — Photocopies of Claim Papers', key: 'docK1' },
      { label: '   Original papers lost — Affidavit on Stamp Paper', key: 'docK2' },
      { label: 'l) Death of Card Holder — Affidavit by Claimant', key: 'docL1' },
      { label: '   Death of Card Holder — No objection from legal Heirs', key: 'docL2' },
      { label: '   Death of Card Holder — Copy of Death Certificate', key: 'docL3' }
    ];
    var docRows = '';
    docs.forEach(function(d, i) {
      docRows += '<tr><td class="left" style="padding:8px 8px;">' + d.label + '</td><td style="width:60px;">Yes / No</td></tr>';
    });
    
    return '<div class="annexure-sheet">' +
      '<div class="annexure-number">ANNEXURE-I</div>' +
      '<div class="annexure-title" style="font-size:15px;">DELHI GOVERNMENT EMPLOYEES HEALTH SCHEME</div>' +
      '<div class="annexure-title\">MODIFIED CHECK LIST FOR REIMBURSEMENT OF MEDICAL CLAIMS</div>' +
      
      '<div style="margin:12px 0;"><strong>1. DGEHS Card No. and Place of Issue:</strong> ' +
      '<span class="field-line" style="min-width:180px;">' + escapeHtml(c.dgehsCardNo) + '</span> &nbsp; ' +
      '<strong>Place:</strong> <span class="field-line" style="min-width:120px;">' + escapeHtml(c.cardPlaceOfIssue) + '</span></div>' +
      
      '<div style="margin:12px 0;"><strong>2. Validity of DGEHS Card:</strong> from ' +
      '<span class="field-line" style="min-width:100px;">' + formatDateDMY(c.validityFrom) + '</span> to ' +
      '<span class="field-line" style="min-width:100px;">' + c.validityTo + '</span></div>' +
      
      '<div style="margin:12px 0;"><strong>3. Ward Entitlement (if Admitted in Hospital):</strong> ' +
      '<span class="field-line" style="min-width:200px;">' + escapeHtml(c.wardEntitlement) + '</span></div>' +
      
      '<div style="margin:12px 0;"><strong>4. Full Name of Employee/Beneficiary (Block Letters):</strong> ' +
      '<span class="field-line" style="min-width:300px;">' + escapeHtml((c.cardHolderName || '').toUpperCase()) + '</span></div>' +
      
      '<div style="margin:12px 0;"><strong>5. Designation:</strong> ' +
      '<span class="field-line" style="min-width:300px;">' + escapeHtml(c.designation) + '</span></div>' +
      
      '<div style="margin:12px 0;"><strong>6. The following documents are submitted:- (Please tick &radic; the relevant column)</strong></div>' +
      '<table class="form-table "><thead><tr><th style="text-align:left;">PARTICULARS</th><th>YES/NO</th></tr></thead><tbody>' + docRows + '</tbody></table>' +
      
      '<div style="margin:15px 0;"><strong>7. Name of the Bank</strong> <span class="field-line" style="min-width:200px;">' + escapeHtml(c.bankName) + '</span> &nbsp; ' +
      '<strong>Branch</strong> <span class="field-line" style="min-width:150px;">' + escapeHtml(c.bankBranch) + '</span></div>' +
      '<div style="margin:10px 0;"><strong>MICR Code</strong> <span class="field-line" style="min-width:120px;">' + escapeHtml(c.micrCode) + '</span> &nbsp; ' +
      '<strong>IFS Code</strong> <span class="field-line" style="min-width:120px;">' + escapeHtml(c.ifscCode) + '</span></div>' +
      '<div style="margin:10px 0;"><strong>SB A/C No.</strong> <span class="field-line" style="min-width:180px;">' + escapeHtml(c.bankAccountNo) + '</span> &nbsp; ' +
      '<strong>Tel. No. of Bank Branch</strong> <span class="field-line" style="min-width:140px;">' + escapeHtml(c.bankTelephone) + '</span></div>' +
      
      '<div class="signature-area" style="margin-top:30px;">' +
      '<div class="signature-left"><div><strong>Dated:</strong> <span class="field-line" style="min-width:100px;">' + formatDateDMY(c.date) + '</span></div></div>' +
      '<div class="signature-right">' +
      '<div>Signature of DGEHS Card Holder <span class="sig-line"></span></div>' +
      '<div style="margin-top:8px;"><strong>Telephone</strong> <span class="field-line" style="min-width:140px;">' + escapeHtml(c.telephoneMobile || c.telephoneOffice || '') + '</span></div>' +
      '</div></div>' +
      
      '<div style="margin-top:20px;font-size:11px;line-height:1.5;">' +
      '<strong>Note:-</strong><br>' +
      '1. Kindly enclose Photocopy of Cancelled Cheque for online transfer of money to the account of beneficiary.<br>' +
      '2. Provide one original copy and two photocopies of complete set of claim.' +
      '</div>' +
    '</div>';
  },

    buildAnnexureIIReimbursementForm: function(p, total, totals) {
    var c = appData.common;
    totals = totals || { OPD: { Consultation: 0, Medicine: 0, Investigation: 0, Other: 0 }, Indoor: { Consultation: 0, Medicine: 0, Investigation: 0, Other: 0 } };
    var opdRowTotal = totals.OPD.Medicine + totals.OPD.Consultation + totals.OPD.Investigation + totals.OPD.Other;
    var indoorRowTotal = totals.Indoor.Medicine + totals.Indoor.Consultation + totals.Indoor.Investigation + totals.Indoor.Other;
    var pName = escapeHtml(p ? p.name : (c.cardHolderName || ''));
    var diag = p ? escapeHtml(p.diagnosis) : '';
    
    return '<div class="annexure-sheet">' +
      '<div class="annexure-number">ANNEXURE-II</div>' +
      '<div class="annexure-title" style="font-size:15px;">DELHI GOVERNMENT EMPLOYEES HEALTH SCHEME</div>' +
      '<div class="annexure-title\">REVISED MEDICAL 2004 FORM FOR REIMBURSEMENT OF MEDICAL CLAIMS OF DGEHS BENEFICIARIES</div>' +
      '<div class="annexure-subtitle\">(To be filled by the claimant)</div>' +
      
      '<div style="margin:10px 0;"><strong>1. DGEHS Card No. and Place of issue:</strong> ' +
      '<span class="field-line" style="min-width:160px;">' + escapeHtml(c.dgehsCardNo) + '</span> ' +
      '<strong>Place:</strong> <span class="field-line" style="min-width:100px;">' + escapeHtml(c.cardPlaceOfIssue) + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>2. Validity of DGEHS Card:</strong> from ' +
      '<span class="field-line" style="min-width:100px;">' + formatDateDMY(c.validityFrom) + '</span> to ' +
      '<span class="field-line" style="min-width:100px;">' + c.validityTo + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>3. Ward Entitlement (if Admitted in Hospital):</strong> ' +
      '<span class="field-line" style="min-width:200px;">' + escapeHtml(c.wardEntitlement) + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>4. Full Name of Employee/Beneficiary (Block Letters):</strong> Mr./Ms. ' +
      '<span class="field-line" style="min-width:350px;">' + escapeHtml((c.cardHolderName || '').toUpperCase()) + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>5. Full Address:</strong> ' +
      '<span class="field-line" style="min-width:450px;">' + escapeHtml(c.fullAddress) + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>6. Telephone No.</strong> (O) ' +
      '<span class="field-line" style="min-width:140px;">' + escapeHtml(c.telephoneOffice) + '</span> ' +
      '(M) <span class="field-line" style="min-width:140px;">' + escapeHtml(c.telephoneMobile) + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>7. E-mail Address if, any:</strong> ' +
      '<span class="field-line" style="min-width:280px;">' + escapeHtml(c.email) + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>8. Name of the Bank</strong> <span class="field-line" style="min-width:180px;">' + escapeHtml(c.bankName) + '</span> ' +
      '<strong>Branch</strong> <span class="field-line" style="min-width:140px;">' + escapeHtml(c.bankBranch) + '</span> ' +
      '<strong>SB A/C No.</strong> <span class="field-line" style="min-width:160px;">' + escapeHtml(c.bankAccountNo) + '</span></div>' +
      '<div style="margin:8px 0 10px 20px;"><strong>Branch MICR Code</strong> <span class="field-line" style="min-width:120px;">' + escapeHtml(c.micrCode) + '</span> ' +
      '<strong>IFS Code</strong> <span class="field-line" style="min-width:120px;">' + escapeHtml(c.ifscCode) + '</span> ' +
      '<strong>Tel. No. of Bank Branch</strong> <span class="field-line" style="min-width:120px;">' + escapeHtml(c.bankTelephone) + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>9. Name of the Patient & Relationship with the Card Holder:</strong> ' +
      '<span class="field-line" style="min-width:300px;">' + appData.patients.map(function(p){ return escapeHtml(p.name); }).join(', ') + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>10. Basic Pay (Excluding Grade Pay):</strong> ' +
      '<span class="field-line" style="min-width:200px;">' + escapeHtml(c.basicPay) + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>11. Name of the Hospital with Address:</strong> ' +
      '<span class="field-line" style="min-width:400px;">' + ((c.hospitalNames || '').trim().split('\n').map(escapeHtml).join('<br>')) + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>12. (a) OPD Treatment (Investigations) & Period of treatment:</strong> ' +
      '<span class="field-line" style="min-width:300px;">' + (c.opdTreatmentFrom || c.opdTreatmentTo ? ('From ' + formatDateDDMMYYYY(c.opdTreatmentFrom) + ' To ' + formatDateDDMMYYYY(c.opdTreatmentTo)) : '') + '</span></div>' +
      '<div style="margin:8px 0 10px 20px;"><strong>(b) Indoor Treatment:</strong> Date of Admission ' +
      '<span class="field-line" style="min-width:100px;">' + (formatDateDMY(c.indoorAdmissionDate) || '') + '</span> Date of Discharge ' +
      '<span class="field-line" style="min-width:100px;">' + (formatDateDMY(c.indoorDischargeDate) || '') + '</span></div>' +
      
      '<div style="margin:10px 0;"><strong>13. Total Amount Claimed:</strong></div>' +
      '<table class="form-table newformat">' +
      '<thead><tr><th></th><th>Medicine<br>Charges</th><th>Consultation<br>Charges</th><th>Investigation<br>Charges</th><th>Other<br>Charges</th><th>Total</th></tr></thead>' +
      '<tbody>' +
      '<tr><td class="left\"><strong>For OPD Treatment</strong></td><td>' + totals.OPD.Medicine.toFixed(2) + '</td><td>' + totals.OPD.Consultation.toFixed(2) + '</td><td>' + totals.OPD.Investigation.toFixed(2) + '</td><td>' + totals.OPD.Other.toFixed(2) + '</td><td>' + opdRowTotal.toFixed(2) + '</td></tr>' +
      '<tr><td class="left\"><strong>For Indoor Treatment</strong></td><td>' + totals.Indoor.Medicine.toFixed(2) + '</td><td>' + totals.Indoor.Consultation.toFixed(2) + '</td><td>' + totals.Indoor.Investigation.toFixed(2) + '</td><td>' + totals.Indoor.Other.toFixed(2) + '</td><td>' + indoorRowTotal.toFixed(2) + '</td></tr>' +
      '<tr style="font-weight:bold;"><td class="left\">Total Amount Claimed</td><td colspan=\"5\">' + (total ? 'Rs. ' + total.toFixed(2) + '/-' : '') + '</td></tr>' +
      '</tbody></table>' +
      
      '<div style="margin:10px 0;"><strong>14. Details of Referral:</strong> ' +
      '<span class="field-line" style="min-width:400px;\"></span></div>' +
      
      '<div style="margin:10px 0;"><strong>15. Details of Medical Advance if, any:</strong> ' +
      '<span class="field-line" style="min-width:350px;\"></span></div>' +
      
      '<div style="margin:15px 0; border:1px solid #000; padding:12px;\">' +
      '<div style="text-align:center; font-weight:bold; text-decoration:underline; margin-bottom:8px;\">DECLARATION</div>' +
      '<div style="font-size:12px; line-height:1.6; text-align:justify;\">I hereby declare that statements made in the application are true to the best of my knowledge and belief and the person for whom medical expenses were incurred is wholly dependant on me. I am a DGEHS beneficiary and the DGEHS card was valid at the time of treatment. I agree for the reimbursement as is admissible under the rules. Misuse of DGEHS facilities is a criminal offence. Suitable action including cancellation of DGEHS card shall be taken in case of willful suppression of facts or submission of false statements. Suitable disciplinary action shall be taken in case of serving employees.</div>' +
      '</div>' +
      
      '<div class="signature-area" style="margin-top:20px;">' +
      '<div class="signature-left"><div><strong>Dated:</strong> <span class="field-line" style="min-width:100px;">' + formatDateDMY(c.date) + '</span></div></div>' +
      '<div class="signature-right">' +
      '<div>Signature of DGEHS Card Holder <span class="sig-line"></span></div>' +
      '<div style="margin-top:6px;\">Name: <strong>' + escapeHtml(c.cardHolderName) + '</strong></div>' +
      '</div></div>' +
    '</div>';
  },
  
renderDirectAnnexure2: function() {
  var savedPages = appData.common.a2Pages || [];
  var billTotal = this.calculatePatientTotal(0);
  var useOverride = !!appData.common.a2UseOverride;
  var overrideAmt = appData.common.a2AmountOverride || '';

  var particulars = [
    'Duly filled modified checklist for reimbursement of medical claim.',
    'Duly filled Revised Medical 2004 Form for reimbursement.',
    'Photocopy of DGEHS card,',
    'Details of all bills/ vouchers (as per annexure)-',
    'All bills in original',
    'All prescriptions and/or discharge summaries.',
    'All reports of Investigations',
    'Essentiality Certificate',
    'Self-Explanatory Note'
  ];
  var rows = '';
  particulars.forEach(function(item, idx) {
    rows += '<tr><td>' + (idx + 1) + '</td><td class="left">' + escapeHtml(item) + '</td><td><input type="text" class="input-inline direct-a2-page" data-idx="' + idx + '" value="' + escapeHtml(savedPages[idx] || '') + '" style="width:90px;text-align:center;"></td></tr>';
  });

  var amountBlock =
    '<div style="margin-bottom:15px;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;" class="no-print">' +
      '<div style="margin-bottom:8px;"><strong>Claim Amount:</strong> Rs. <span id="a2-live-total">' + billTotal.toFixed(2) + '</span> <span style="color:#64748b;font-size:12px;">(auto-calculated from Annexure 3 bills' + (billTotal === 0 ? ' — add bills to update this' : '') + ')</span></div>' +
      '<label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">' +
        '<input type="checkbox" id="a2-override-toggle" ' + (useOverride ? 'checked' : '') + ' onchange="app.toggleA2Override()"> ' +
        'Claiming a different amount than total bills (e.g. partial claim)' +
      '</label>' +
      '<div id="a2-override-input-wrap" style="margin-top:8px;' + (useOverride ? '' : 'display:none;') + '">' +
        'Rs. <input type="number" id="direct-a2-override-amt" class="input-inline" value="' + escapeHtml(String(overrideAmt || billTotal)) + '" style="width:120px;text-align:center;" onchange="app.updateA2OverridePreview()">' +
      '</div>' +
    '</div>';

  var displayAmt = useOverride ? (parseFloat(overrideAmt) || billTotal) : billTotal;

  var html = '<div class="annexure-sheet">' +
    '<div class="annexure-number">Annexure - 2</div>' +
    '<div class="annexure-title">COVERING LETTER OF MEDICAL REIMBURSEMENT CLAIMS</div>' +
    '<div class="annexure-subtitle">(For Single claim)</div>' +
    '<div style="margin-bottom:15px;"><div>To</div><div style="margin-left:30px;white-space:pre-line;">' + escapeHtml(appData.common.toAddress) + '</div></div>' +
    '<div style="margin-bottom:15px;"><strong>Subject :-</strong> Submission of Medical Bills for reimbursement in R/o <strong>' + escapeHtml(appData.common.cardHolderName) + '</strong></div>' +
    amountBlock +
    '<div style="margin-bottom:15px;">Respected Sir/Madam,<br><br>With reference to the subject cited above find enclosed here with Medical Bills amounting to <strong>Rs. <span id="a2-final-amt">' + displayAmt.toFixed(2) + '</span>/-</strong> as detailed below:</div>' +
    '<table class="form-table newformat"><thead><tr><th>#</th><th>Particulars</th><th>Page No.<br>From&ndash;To</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '<div style="margin-top:20px;margin-bottom:20px;">You are requested to release the amount <strong>Rs. <span id="a2-final-amt2">' + displayAmt.toFixed(2) + '</span>/-</strong><br>(Rupees <strong><span id="a2-final-words">' + numberToWords(displayAmt) + '</span></strong>) as soon as possible and oblige me.</div>' +
    '<div class="signature-area"><div class="signature-left"><div>Dated: <span style="border-bottom:1px solid #000;display:inline-block;width:120px;">' + formatDateDMY(appData.common.date) + '</span></div><div>Place:- ' + escapeHtml(appData.common.placeOfPosting) + '</div></div>' +
    '<div class="signature-right"><div>Thanking you,</div><div style="margin-top:40px;">Yours Sincerely</div><div style="margin-top:30px;"><div>Signature of DGEHS Card Holder <span class="sig-line"></span></div><div>Name of DGEHS Card Holder <strong>' + escapeHtml(appData.common.cardHolderName) + '</strong></div><div>Designation <strong>' + escapeHtml(appData.common.designation) + '</strong></div><div>Place of Posting <strong>' + escapeHtml(appData.common.placeOfPosting) + '</strong></div></div></div></div>' +
  '</div>';
  document.getElementById('annexure2-direct-form').innerHTML = html;
},

toggleA2Override: function() {
  var checked = document.getElementById('a2-override-toggle').checked;
  document.getElementById('a2-override-input-wrap').style.display = checked ? '' : 'none';
  this.updateA2OverridePreview();
},

updateA2OverridePreview: function() {
  var useOverride = document.getElementById('a2-override-toggle').checked;
  var billTotal = this.calculatePatientTotal(0);
  var amt = useOverride ? (parseFloat(document.getElementById('direct-a2-override-amt').value) || billTotal) : billTotal;
  document.getElementById('a2-final-amt').textContent = amt.toFixed(2);
  document.getElementById('a2-final-amt2').textContent = amt.toFixed(2);
  document.getElementById('a2-final-words').textContent = numberToWords(amt);
},


updateDirectTotal2: function() {
  var amt = parseFloat(document.getElementById('direct-a2-amt').value) || 0;
  document.getElementById('direct-a2-total').textContent = amt.toFixed(2);
  document.getElementById('direct-a2-words').textContent = numberToWords(amt);
},


saveAnnexure2Data: function() {
  var pageInputs = document.querySelectorAll('.direct-a2-page');
  var pages = [];
  pageInputs.forEach(function(el) { pages.push(el.value || ''); });

  appData.common.a2Pages = pages;
  appData.common.a2UseOverride = document.getElementById('a2-override-toggle').checked;
  appData.common.a2AmountOverride = document.getElementById('direct-a2-override-amt') ? document.getElementById('direct-a2-override-amt').value : '';
  appData.common.a2Filled = true;
  saveToStorage();

  var status = document.getElementById('a2-save-status');
  if (status) {
    status.textContent = 'Saved!';
    setTimeout(function() { status.textContent = ''; }, 2500);
  }
},

goFillAnnexure3FromA2: function() {
  this.saveAnnexure2Data();
  this.renderAnnexure3Fill();
  showScreen('annexure3-fill-screen');
},



buildAnnexure2SheetFromSaved: function() {
  var amt = this.getA2Amount();
  var words = numberToWords(amt);
  var pages = appData.common.a2Pages || [];
  var particulars = [
    'Duly filled modified checklist for reimbursement of medical claim.',
    'Duly filled Revised Medical 2004 Form for reimbursement.',
    'Photocopy of DGEHS card,',
    'Details of all bills/ vouchers (as per annexure)-',
    'All bills in original',
    'All prescriptions and/or discharge summaries.',
    'All reports of Investigations',
    'Essentiality Certificate',
    'Self-Explanatory Note'
  ];
  var encRows = '';
  particulars.forEach(function(item, idx) {
    encRows += '<tr><td>' + (idx + 1) + '</td><td class="left">' + escapeHtml(item) + '</td><td>' + escapeHtml(pages[idx] || '') + '</td></tr>';
  });
  return '<div class="annexure-sheet">' +
    '<div class="annexure-number">Annexure - 2</div>' +
    '<div class="annexure-title">COVERING LETTER OF MEDICAL REIMBURSEMENT CLAIMS</div>' +
    '<div class="annexure-subtitle">(For Single claim)</div>' +
    '<div style="margin-bottom:15px;"><div>To</div><div style="margin-left:30px;white-space:pre-line;">' + escapeHtml(appData.common.toAddress) + '</div></div>' +
    '<div style="margin-bottom:15px;"><strong>Subject :-</strong> Submission of Medical Bills for reimbursement in R/o <strong>' + escapeHtml(appData.common.cardHolderName) + '</strong></div>' +
    '<div style="margin-bottom:15px;">Respected Sir/Madam,<br><br>With reference to the subject cited above find enclosed here with Medical Bills amounting to <strong>Rs. ' + amt.toFixed(2) + '/-</strong> as detailed below:</div>' +
    '<table class="form-table newformat"><thead><tr><th>#</th><th style="text-align:left;">PARTICULARS</th><th>Page No.<br>From--To</th></tr></thead><tbody>' + encRows + '</tbody></table>' +
    '<div style="margin-top:20px;margin-bottom:20px;">You are requested to release the amount <strong>Rs. ' + amt.toFixed(2) + '/-</strong><br>(Rupees <strong>' + words + '</strong>) as soon as possible and oblige me.</div>' +
    '<div class="signature-area"><div class="signature-left"><div>Dated: <span style="border-bottom:1px solid #000;display:inline-block;width:120px;">' + formatDateDMY(appData.common.date) + '</span></div><div>Place:- ' + escapeHtml(appData.common.placeOfPosting) + '</div></div>' +
    '<div class="signature-right"><div>Thanking you,</div><div style="margin-top:40px;">Yours Sincerely</div><div style="margin-top:30px;"><div>Signature of DGEHS Card Holder <span class="sig-line"></span></div><div>Name of DGEHS Card Holder <strong>' + escapeHtml(appData.common.cardHolderName) + '</strong></div><div>Designation <strong>' + escapeHtml(appData.common.designation) + '</strong></div><div>Place of Posting <strong>' + escapeHtml(appData.common.placeOfPosting) + '</strong></div></div></div></div>' +
  '</div>';
},

  updateDirectTotal: function() {
    var amt = parseFloat(document.getElementById('direct-a1-amt').value) || 0;
    document.getElementById('direct-a1-total').textContent = amt.toFixed(2);
    document.getElementById('direct-a1-total2').textContent = amt.toFixed(2);
    document.getElementById('direct-a1-words').textContent = numberToWords(amt);
  },
  saveDirectAnnexure1: function() {
    var amt = parseFloat(document.getElementById('direct-a1-amt').value) || 0;
    if (!amt) { alert('Please enter amount.'); return; }
    var html = document.getElementById('annexure2-direct-form').innerHTML;
    document.getElementById('single-output-container').innerHTML = '<div class="no-print" style="text-align:center;margin-bottom:20px;"><h2 class="text-xl font-bold text-slate-800">Generated Annexure 1</h2><button class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-sm transition-all" onclick="window.print()">Print</button><button class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors ml-2" onclick="app.goHome()">Start New</button></div>' + html;
    showScreen('output-single-screen');

        this.fitA4();
  },



  showPrivacyConfirm: function() {
  document.getElementById('privacy-confirm-modal').classList.remove('hidden');
},

closePrivacyModal: function() {
  document.getElementById('privacy-confirm-modal').classList.add('hidden');
},

clearAllDataFromModal: function() {
  if (!confirm('This will permanently delete all saved details from this browser. Continue?')) {
    return;
  }
  this.closePrivacyModal();
  this.clearStorage();   // <-- your existing "Clear Saved Data" function name
},
  editAgain: function() {
  if (appData.singleAnnexureChoice === '2' && appData.mode === 'single') showScreen('annexure2-direct-screen');
  else { this.renderAnnexure3Fill(); showScreen('annexure3-fill-screen'); }
},
  printAllSingle: function() {
    document.getElementById('output-single-screen').classList.add('print-target');
    window.print();
    this.showPrivacyConfirm();
    document.getElementById('output-single-screen').classList.remove('print-target');
  },
  printAllMultiple: function() {
    document.getElementById('output-multiple-screen').classList.add('print-target');
    window.print();
    this.showPrivacyConfirm();
    document.getElementById('output-multiple-screen').classList.remove('print-target');
  },


};

document.addEventListener('DOMContentLoaded', function() {
  app.init();
});
