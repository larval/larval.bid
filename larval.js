/*|___ ___ _ _ ___| |  A butchered fork of larval.com (stocks) for this special niche (domains).
| | .'|  _| | | .'| |  (: An excuse to escape into the nostalgia of slapping something together agian :)
|_|__,|_|  \_/|__,|*/

const $L = { _components: ['EVT', 'ASK', 'CFG', 'GUI', 'HST', 'DAT', 'NFY', 'NET', 'ANI', 'MRQ', 'POL', 'TOP'],
_title:	'',
_titlePrefix: '',
_wakeLock: null,
_fragments: {},
_warnings: [],
_extURLOptions: 'noreferrer noopener',
_topURLMap: { '@#':/^[#/]*?([A-Z0-9_]+)\/message\/([0-9]+)/i, '@':/^[#/]*?([A-Z0-9_]{5,32}|((?=.*?\d)(?=.*?[A-Z])[A-Z\d]+))\/?$/i, '$':/^[#/]*?symbol\/([A-Z]{1,4})\/?$/ },
_multipliers: { 'B':1000000000, 'M':1000000, 'K':1000, '':1 },
_symbolsStatic: ['^VIX', '^DJI', '^GSPC', '^IXIC', '^RUT', '^TNX', '^TYX'],
_assetTypes: ['l_bids'],
_char: { 'up':"\u25b2 ", 'down':"\u25bc ", 'updown':"\u21c5 ", 'warning':"\u26a0 ", 'halt':"\u25a0 ", 'etf':"~", 'crypto':"*", 'futures':'^', 'currency':"$", 'user':"@" },
_themes: {
	'default':    ['#FAAD69','#FCE4BD','#DEA876','#FF9A3D','#7AFFED','#55B8FA','#302D2A','#363330','#3C3936','#006A82','#96EBFF','#D4F3FA','#96EBFF','#00AA00','#D4F3FA','#FF0000','#FAB45F','#DEB28C','#E6F6FA'],
	'ask':        ['#FA6969','#FCBDBD','#DE7676','#FF773D','#7AFFAD','#55F7FA','#302D2A','#363330','#3C3936','#006A82','#96EBFF','#D4F3FA','#96EBFF','#00AA00','#D4F3FA','#FF0000','#FA905F','#DEA58C','#E6F6FA']
}, _theme: '', _themeBGColorIndex: 7,
_keyMap: {
	'DD': ['https://www.dynadot.com/market/auction/@'],
	'GD': ['https://auctions.godaddy.com/trpItemListing.aspx?miid=@'],
	'NC': ['https://www.namecheap.com/market/@/'],
	'XX': ['https://www.whois.com/whois/@']
},
_taMap: {
	'AS': ['Ascending triangle', '&#128200;&nbsp;asc<i>&nbsp;triangle</i>', 'F'],
	'CD': ['Channel down', '&#128201;&nbsp;c<i>hannel&nbsp;</i>down', 'F'],
	'CH': ['Channel', '&#128200;&nbsp;chan<i>nel</i>', 'F'],
	'CU': ['Channel up', '&#128200;&nbsp;c<i>hannel&nbsp;</i>up', 'F'],
	'D1': ['Barchart directional top 1%', '&#128200;&nbsp;<i>&nbsp;barchart&nbsp;</i>top&nbsp;1%', 'B'],
	'DB': ['Double bottom', '&#128200;&nbsp;2x&nbsp;bot<i>tom</i>', 'F'],
	'DE': ['Descending triangle', '&#128201;&nbsp;desc<i>&nbsp;triangle</i>', 'F'],
	'DT': ['Double top', '&#128201;&nbsp;2x&nbsp;top', 'F'],
	'HI': ['Inverse head and Ssoulders', '&#128200;&nbsp;inv<i>erse</i>&nbsp;h&amp;s', 'F'],
	'HS': ['Head and shoulders', '&#128201;&nbsp;h&nbsp;&amp;&nbsp;s', 'F'],
	'HZ': ['Horizontal S/R', '&#128200;&nbsp;s&nbsp;&amp;&nbsp;r', 'F'],
	'LF': ['Low float', '&#128640;&nbsp;<i>low&nbsp;</i>float', 'F'],
	'MB': ['Multiple bottoms', '&#128200;&nbsp;&gt;2x&nbsp;bot<i>tom</i>s', 'F'],
	'MT': ['Multiple tops', '&#128201;&nbsp;&gt;2x&nbsp;tops', 'F'],
	'S1': ['Barchart strength top 1%', '&#128200;&nbsp;<i>&nbsp;barchart&nbsp;</i>top&nbsp;1%', 'B'],
	'SI': ['High short interest', '&#128640;&nbsp;short<i>&nbsp;interest</i>&nbsp;%', 'G'],
	'TR': ['Technical resistance', '&#128201;&nbsp;resist<i>ance</i>', 'F'],
	'TS': ['Technical support', '&#128200;&nbsp;<i>tech&nbsp;</i>support', 'F'],
	'WD': ['Wedge down', '&#128201;&nbsp;wedge<i>&nbsp;down</i>', 'F'],
	'WE': ['Wedge', '&#128200;&nbsp;wedge', 'F'],
	'WU': ['Wedge up', '&#128200;&nbsp;wedge<i>&nbsp;up</i>', 'F']
},
_eventMap: {
	   '#l_root': {
			click:e     => void(0),
	}, '#l_audible, #l_tld_com, #l_tld_net, #l_tld_org, #l_tld_else, #l_numbers, #l_hyphens': {
			change:e    => $CFG.change(e)
	}, '#l_range_bids, #l_range_mins, #l_range_len': {
			input:e     => $CFG.updateRange(e),
			change:e    => $CFG.change(e)
	}, '#l_content_table': {
			mousemove:e => $keyModeReset()
	}, 'animate': {
			endEvent:e  => e && e.target && e.target.setAttribute('begin', '')
	}
},
_clickMap: {
	'l_alt_link':_              => location.href='//larval.com',
	'l_content_table_header':_  => $DAT.setStageSort(_.idx),
	'l_fixed':_                 => $GUI.broadBehaviorToggle($TOP.ON),
	'l_history_toggle':_        => $HST.dropDownToggle(_.idx),
	'l_hotkey_help':_           => $MRQ.hotKeyHelp(),
	'l_last_update':_           => $POL.forceNextStage(),
	'l_marquee_flash':_         => $HST.gotoStageData(0),
	'l_marquee_info':_          => $DAT.setURLFormat(_.sym, false),
	'l_marquee_talk':_          => $TOP.searchFromURL(_.raw, true),
	'l_menu_link':_             => $GUI.menuClick(_.el.innerText),
	'l_news':_                  => typeof $DAT.DATA['items'][_.idx][$LNK]=='number' ? $GUI.relatedToggle(_.idx) : $W.open($DAT.DATA['items'][_.idx][$LNK], `l_news_${_.sym}`, _extURLOptions),
	'l_notify_disable':_        => $NFY.exception($DAT.DATA['items'][_.idx][$DOM], true),
	'l_notify_enable':_         => $NFY.exception($DAT.DATA['items'][_.idx][$DOM], false),
	'l_related':_               => $GUI.relatedToggle(_.idx),
	'l_settings_button':_       => $CFG.buttonToggle(null, true),
	'l_ta':_                    => $W.open(_keyMap[_.el.dataset.keymap?_.el.dataset.keymap:$GUI.KEY_MAP_IDX_DEFAULT][$KSTK].replace('@', _.sym), `l_ta_${_.sym}`, _extURLOptions),
	'l_tab':_                   => $CFG.tabSelect(_.el),
	'l_warning_audio':_         => $NFY.playAudio(_audioTest, false, true),
	'l_warning_never_notify':_  => $NFY.requestPermission(true),
	'shift_default':_           => void(0),
	'alt_default':_             => void(0),
	'default':_                 => $W.open($createURL(_.sym, _.type), `l_${_.type}_${_.sym}`, _extURLOptions)
},
_hotKeyMap: {
	'ArrowDown':e               => $GUI.KEY_ROW++,
	'ArrowUp':e                 => $GUI.KEY_ROW--,
	'ArrowLeft':e               => $HST.gotoStageData(1),
	'ArrowRight':e              => $HST.gotoStageData(-1),
	'Backslash':(e,ev)          => $ANI.toggle(null, ev.shiftKey),
	'End':e                     => $GUI.KEY_ROW = e.parentElement.childElementCount - 1,
	'Enter':e                   => $EVT.click(e),
	'Equal':e                   => $CFG.updateAudioVolume(true),
	'Escape':e                  => $GUI.broadBehaviorToggle($TOP.ON),
	'F5':e                      => $CFG.clear('User requested.'),
	'F8':e                      => $NET.nextURL(true) && $MRQ.flash(`Changed endpoint to: <i>${$NET.URL}</i>`),
	'F12':e                     => $GUI.setThemeRandom('<i>Going under the hood?</i> Let\'s make the outside look as hideous as the inside first.'),
	'Home':e                    => $GUI.KEY_ROW = 1,
	'Minus':e                   => $CFG.updateAudioVolume(false),
	'Pause':e                   => $CFG.updateAudio(!$E('l_audible').checked),
	'NumpadAdd':e               => $CFG.updateAudioVolume(true),
	'NumpadSubtract':e          => $CFG.updateAudioVolume(false),
	'NumpadEnter':e             => $EVT.click(e),
	'PageDown':e                => $GUI.KEY_ROW+=$GUI.TABLE_ROWS_IN_VIEW,
	'PageUp':e                  => $GUI.KEY_ROW-=$GUI.TABLE_ROWS_IN_VIEW,
	'Slash':e                   => $MRQ.hotKeyHelp(),
	'Space':e                   => $EVT.click(e),
	'Tab':(e,ev)                => $ANI.toggle(null, ev.shiftKey)
}, _hotKeyMapIgnore: ['ShiftLeft','ShiftRight'],
_enumMap: {
	'bid': {
		'AID':_   => _.val.substr(1,2),
		'DOM':_   => $H(_.val),
		'AGE':_   => $H(_.val)+'Y',
		'TRF':_   => $H(_.val),
		'BID':_   => $H(_.val),
		'PRC':_   => '$'+$N(Math.abs(_.val), 2),
		'TMU':_   => $dateFormat(_.val, true),
		'TME':_   => $dateFormat(_.val),
		'LBID':_  => _.val ? ('+'+(_.row[$BID]-_.val<0?0:_.row[$BID]-_.val)) : 0,
		'LPRC':_  => _.val ? ('+$'+$N(Math.abs(_.row[$PRC]-_.val),2)) : 0,
		'LTMU':_  => $timeRemaining(_.row[$TMU],true),
		'LTME':_  => $timeRemaining(_.row[$TME],true),
		'KSTK':0, 'KETF':0, 'KCRP':1, 'KFTR':2, 'KCUR':3, 'KUSR':4,
		'WAUD':0, 'WNOT':1, 'HLT':2, 'REL':8
	},
	'ask': {
		'ADOM':_   => $H(_.val),
		'APRC':_   => '$'+$N(Math.abs(_.val), 2),
		'ACHG':_   => '$'+$N(Math.abs(_.val), 2),
		'HMID':0, 'HPRC':1, 'HMOD':2, 'HPCT':3, 'HPCR':4, 'HSTR':5, 'HEND':6, 'HILT':7
	}
},
_settings: {
	'l_version':          2,
	'l_audible':          false,
	'l_notify_halts':     true,
	'l_options_only':     false,
	'l_keymap_index':     '',
	'l_symbols_on_top':   '',
	'l_exceptions':       '',
	'l_vpm':              null,
	'l_no_notifications': false,
	'l_range_bids':       1,
	'l_range_mins':       30,
	'l_range_len':        20,
	'l_numbers':          false,
	'l_hyphens':          false,
	'l_tld_com':          true,
	'l_tld_net':          true,
	'l_tld_org':          true,
	'l_tld_else':         true,
	'l_bids':             { 'l_show': true }
}, _settingsBase: {}, _settingsSelectedTab: {}, _settingsSelectedTabName: 'l_bids',
_vibrateAlert: [250,250,500,250,750,250,1000], _audioAlert: '/larval.mp3', _audioTest: 'data:audio/mpeg;base64,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',

/*************************************************************************************************\
\*******  SHORTHAND / COMMON  *************************************************  [ $?.* ]  *******/
A: query => (_A = $D.querySelectorAll(query)), _A: null,
B: id => (_B = $D.getElementById(id).getBoundingClientRect()), _B: null,
C: className => (_C = $D.getElementsByClassName(className)), _C: null,
D: document,
E: id => (_E = $D.getElementById(id)), _E: null,
F: (id, a) => (_F = (_fragments[id]?_fragments[id]:(_fragments[id]=($E(id)?_E.innerHTML:id).split('@'))).forEach((x,i)=>a&&a.splice(i*2,0,_fragments[id][i]))||(a?a:_fragments[id]).join('')), _F: null,
H: string => (_H = (_H=$D.createElement('p'))&&((_H.textContent=string)) ? _H.innerHTML : ''), _H: null,
I: (array, item) => (_I = array.indexOf(item)), _I: -1,
M: (match, string) => (_M = string && string.match(match)), _M: null,
N: (number, digits) => number.toLocaleString(undefined, { minimumFractionDigits: digits,  maximumFractionDigits: digits }),
P: (count, total) => Math.round(count / total * 100),
Q: query => (_Q = $D.querySelector(query)), _Q: null,
S: (array, match) => (_S = array.split(match)), _S: null,
T: tagName => (_T = $D.getElementsByTagName(tagName)), _T: null,
U: array => array.filter((x,i,a) => array.indexOf(x)==i),
W: window,
X: obj => Array.isArray(obj) ? obj.filter(Boolean) : JSON.parse(JSON.stringify(obj,(k,v)=>v?v:undefined)),
Z: (str, ms) => {
	if(!_Z || (Date.now() - _Z) > (ms?ms:250))
		console.log(new Date(_Z=Date.now()).toLocaleTimeString('en-US',{hour:"numeric",minute:"numeric",second:'numeric'})+'-'.repeat(80));
	try { throw new Error(); }
	catch(e) {
		if(e&&e.stack) console.log($X(e.stack.split(/[\r\n]/g).map((x,i) => { let m=x.match(/\s*at\s+([^ ]+)/i); return !m||!m[1]||m[1].match(/[^A-Z0-9]/i)?null:m[1]; } )).splice(1).reverse().join(" \u279C ") + (typeof str=='undefined'?'':`  \u2588  ${str}`));
		else console.trace();
	}
}, _Z: null,

/*************************************************************************************************\
\*******  APP ENTRY POINT (main)  ******************************************  [ $L.LOAD ]  *******/
LOAD: e => {
	if(location.protocol == 'http:')
		location.protocol = 'https:';
	for(let k of Object.keys($L))
		window[k[0]=='_'?k:('$'+k)] = $L[k];
	_components.forEach(c => $L[c].setup());
	$D.childNodes.forEach(c => c.nodeType==Node.COMMENT_NODE ? console.log(c.nodeValue) : null);
},

/*************************************************************************************************\
\*******  GLOBAL EVENTS (automatically hooked)  *****************************  [ $EVT.* ]  *******/
EVT: {
	setup: () => {
		for(let k of Object.keys($EVT))
			(typeof window['on'+k]=='undefined'?$D:$W).addEventListener(k, $EVT[k]);
		for(let query of Object.keys(_eventMap)) {
			if(!$A(query)) continue;
			for(let a=0; a < _A.length; a++) {
				for(let e of Object.keys(_eventMap[query]))
					_A[a].addEventListener(e, _eventMap[query][e]);
			}
		}
	},
	click: e => {
		let idx=0, msgIdx=-1, sym='', type=$KSTK, dataRef=null, ref='', refList=Object.keys(_clickMap), el=(e&&e.target?e.target:e);
		$NFY.setup(true);
		if(!el || !$DAT.DATA) return;
		for(let next=el; !!next.parentElement; next=next.parentElement) {
			if(!ref) {
				for(let c in refList) {
					if(next.id != refList[c] && !next.classList.contains(refList[c]))
						continue;
					ref = refList[c];
					el = next;
					break;
				}
			}
			if(typeof next.dataset=='object') {
				if(dataRef === null && typeof next.dataset.ref=='string')
					dataRef = isNaN(next.dataset.ref) ? next.dataset.ref : parseInt(next.dataset.ref, 10);
				if(msgIdx < 0 && typeof next.dataset.msgIdx=='string')
					msgIdx = parseInt(next.dataset.msgIdx, 10);
			}
			if(dataRef !== null && ref)
				break;
		}
		$GUI.KEY_MAP_IDX = 'XX';
		if(typeof dataRef == 'string')
			sym = dataRef;
		else if(typeof dataRef == 'number') {
			idx = dataRef;
			if(!$DAT.DATA['items'][idx])
				sym = idx;
			else if($DAT.DATA['items'][idx][$AID].length > 3)
				sym = $DAT.DATA['items'][idx][$AID].substr(3);
			else
				sym = $DAT.DATA['items'][idx][$DOM];
			if(!$ASK.ON)
				$GUI.KEY_MAP_IDX = $DAT.DATA['items'][idx][$AID].substr(1,2);
		}
		const raw=sym;
		if((e.ctrlKey || e.altKey || e.type=='contextmenu') && (el.dataset&&el.dataset.alt!='none'))
			ref = 'alt_default';
		else if(e.shiftKey && sym)
			ref = 'shift_default';
		else if(sym && !ref)
			ref = 'default';
		else if(msgIdx>=0 && $DAT.DATA['items'][idx][$THST] && $DAT.DATA['items'][idx][$THST][msgIdx]) {
			sym += '/message/' + $DAT.DATA['items'][idx][$THST][msgIdx][$HMID];
			ref = 'default';
		}
		else if(!ref) return;
		if($I(_symbolsStatic,sym) >= 0)      { type = $KSTK; sym = _symbolsStatic[_I]; }
		else if(sym[0] == _char['user'])     { type = $KUSR; sym = sym.substr(1); }
		else if(sym[0] == _char['etf'])      { type = $KETF; sym = sym.substr(1); }
		else if(sym[0] == _char['crypto'])   { type = $KCRP; sym = sym.substr(1); }
		else if(sym[0] == _char['futures'])  { type = $KFTR; sym = sym.substr(1); }
		else if(sym[0] == _char['currency']) { type = $KCUR; sym = ((sym.substr(-1)=='-'?'USD':sym)+(sym.substr(-1)=='+'?'USD':sym)).replace(/[^A-Z]+/g,''); }
		_clickMap[ref]({'raw':raw, 'sym':sym, 'idx':idx, 'type':type, 'el':el});
	},
	keydown: e => {
		$ANI.fastSplash();
		if(!$ANI.COMPLETE||!$DAT.DATA||$TOP.LOG||(e&&(e.ctrlKey||e.altKey))||(e&&$DAT.toggleStage(e)))
			return;
		$GUI.contentTableRoll(e&&e.shiftKey);
		let rows=$E('l_content_table').getElementsByTagName('tr'), lastKeyRow=$GUI.KEY_ROW, match;
		if($TOP.ON) {
			if($I(['Escape','Backspace','Delete'],(match=e&&e.code)?match:'') >= 0 && (!_I||!$TOP.searchCriteria()))
				return($GUI.broadBehaviorToggle(true));
			else if(!$isMobile(false) && (!document.activeElement || document.activeElement.id!='l_top_search'))
				$E('l_top_search').focus();
			$CFG.buttonToggle(true);
			$TOP.searchRunOnEnter(e);
			return;
		}
		if(!$GUI.KEY_ROW) {
			for(let i=0; i < rows.length; i++) {
				if(!rows[i].matches(':hover'))
					continue;
				lastKeyRow = 0;
				$GUI.KEY_ROW = i;
				break;
			}
		}
		if(e === false)
			$GUI.KEY_ROW = 0;
		else if(e) {
			e.preventDefault();
			if($I(_hotKeyMapIgnore,e.code) >= 0)
				return;
			else if(_hotKeyMap[e.code])
				_hotKeyMap[e.code](rows[$GUI.KEY_ROW], e);
			else if((match=e.code.match(/^(Digit|Numpad)([0-9])$/)))
				$DAT.setStageSort(parseInt(match[2]));
			else if((match=e.code.match(/^Key([A-Z])$/))) {
				$DAT.setURLFormat(match[1], e.shiftKey);
				$EVT.click(rows[$GUI.KEY_ROW]);
			}
			else if(e.code)
				$MRQ.flash(`The &quot;<i>${e.code}</i>&quot; key is not mapped, type &quot;<i>?</i>&quot; to see the supported hotkeys.`);
		}
		if($GUI.KEY_ROW < 0)
			$GUI.KEY_ROW = 0;
		else if($GUI.KEY_ROW >= rows.length)
			$GUI.KEY_ROW = rows.length - 1;
		if(!lastKeyRow ^ !$GUI.KEY_ROW) {
			const addOrRemove = ($GUI.KEY_ROW?'add':'remove');
			if(lastKeyRow && rows[lastKeyRow])
				rows[lastKeyRow].classList.remove('l_tr_keyrow_selected');
			for(let i=1; i < rows.length; i++)
				rows[i].classList[addOrRemove]('l_tr_keyrow');
		}
		if(lastKeyRow && rows[lastKeyRow])
			rows[lastKeyRow].classList.remove('l_tr_keyrow_selected');
		rows[$GUI.KEY_ROW].classList.add('l_tr_keyrow_selected');
		if($GUI.KEY_ROW > 0)
			rows[$GUI.KEY_ROW].scrollIntoView({behavior:'smooth', block:'center'});
	},
	keypress: e => $TOP.searchRunOnEnter(e),
	keyup: e => $GUI.contentTableRoll(e.shiftKey),
	visibilitychange: e => {
		$GUI.FRAMES = null;
		if(!$isVisible()) return;
		$updateTitleWithPrefix('');
		$NFY.requestWakeLock();
		while($NFY.NOTIFICATIONS.length > 0)
			($NFY.NOTIFICATIONS.shift()).close();
		if($TOP.ON)
			$MRQ.update();
		else if($MRQ.INTERVAL) {
			$MRQ.update(true);
			$POL.progressReset();
		}
	},
	resize: e => {
		if($isMobile(false)) return;
		$CFG.buttonToggle(false);
		$GUI.contentTableUpdateRowCountThatAreInView();
		$GUI.contentTableUpdate();
	},
	scroll: e => {
		const scrolledDown=$E($ANI.ID) || (($W.pageYOffset||$D.documentElement.scrollTop) > $E('l_fixed').offsetHeight);
		const percent=($D.documentElement.scrollTop||$D.body.scrollTop) / (($D.documentElement.scrollHeight||$D.body.scrollHeight) - $D.documentElement.clientHeight) * 100;
		if(percent > 80 && $GUI.TABLE_SOFT_LIMIT > 0) {
			$GUI.TABLE_SOFT_LIMIT = -$GUI.TABLE_SOFT_LIMIT;
			$GUI.contentTableUpdate();
		}
		$E('l_fixed').className = scrolledDown ? 'l_scrolled' : 'l_not_scrolled';
	},
	contextmenu: e => {
		e.preventDefault();
		$EVT.click(e);
	},
	touchstart: e => $GUI.SWIPE_START = [e.changedTouches[0].clientX, e.changedTouches[0].clientY, -1],
	touchmove: e => {
		const height=$W.innerHeight||$D.documentElement.clientHeight||$D.body.clientHeight;
		if($W.pageYOffset || !$ANI.COMPLETE || !$GUI.SWIPE_START || $TOP.ON || height < 1 || (e.touches&&e.touches.length>1))
			$GUI.SWIPE_START = null;
		else if($GUI.SWIPE_START[2] < 0)
			$GUI.SWIPE_START[2] = e.changedTouches[0].clientY;
		else if($E('l_fixed_highlight'))
			_E.style.opacity = String(Math.min(1, (e.changedTouches[0].clientY-$GUI.SWIPE_START[2])*2/height));
	},
	touchend: e => {
		if($E('l_fixed_highlight') && _E.style.opacity)
			_E.style.opacity = 0;
		if(!$GUI.SWIPE_START || $TOP.ON) return;
		const swipeMovement = [e.changedTouches[0].clientX-$GUI.SWIPE_START[0], e.changedTouches[0].clientY-$GUI.SWIPE_START[1], e.changedTouches[0].clientY-$GUI.SWIPE_START[2]],
			width = $W.innerWidth||$D.documentElement.clientWidth||$D.body.clientWidth,
			height = $W.innerHeight||$D.documentElement.clientHeight||$D.body.clientHeight,
			movementPercent = [Math.abs(swipeMovement[0])/width*100, Math.abs(swipeMovement[1])/height*100, swipeMovement[2]/height*100],
			movementWeighting = (movementPercent[0]+1) / (movementPercent[1]+1);
		if(movementPercent[0] > 25 && movementWeighting >= 1)
			$HST.gotoStageData(swipeMovement[0]);
		else if(movementPercent[2] > 25 && movementWeighting <= 1 && $GUI.SWIPE_START[2] > 0)
			$POL.forceNextStage();
		$GUI.SWIPE_START = null;
	},
	popstate: e => {
		$CFG.buttonToggle(false);
		if(!e || !e.state || $TOP.LOG) {
			if(!$TOP.ON)
				$HST.gotoStageData(1);
			return;
		}
		if($HST.SESSION_ID < 0) {
			if(!e.state.session || e.state.root) {
				if($HST.NEXT) {
					$DAT.toggleStage($HST.NEXT);
					$HST.NEXT = '';
				}
				$HST.SESSION_ID = -$HST.SESSION_ID;
			}
			else
				$W.history.back();
			return;
		}
		else if($TOP.ON && e.state.items)
			$NET.parseStageData(e.state, {'fromPopState':true,'updateView':true});
		else if(typeof(e.state.toggle) == 'boolean' || e.state.root)
			$DAT.toggleStage(e.state.root || e.state.toggle);
		else if($TOP.ON === (typeof(e.state.fixed) != 'undefined'))
			$DAT.toggleStage($TOP.ON);
		else if(typeof(e.state.fixed) == 'number') {
			$W.history.go(e.state.fixed);
			$HST.gotoStageData(e.state.fixed);
		}
		else if(typeof(e.state.fixed) != 'undefined')
			$W.history.replaceState(e.state, null, '/');
	}
},

/*************************************************************************************************\
\*******  ANIMATION LOGIC  **************************************************  [ $ANI.* ]  *******/
ANI: {
	ID: 'l_na', COMPLETE: false,

	setup: () => {
		$ANI.disableIfUnderFPS(6000, 30, 2);
		setTimeout($ANI.complete, 5750);
	},
	complete: fastSplash => {
		if($ANI.COMPLETE) return;
		$ANI.COMPLETE = true;
		if(!fastSplash && $E($ANI.ID))
			_E.className = $ANI.ID;
		$E('l_root').classList.add('l_animations_complete');
		$E('l_menu').className = ($DAT.DATA && !$isWeekend() ? $GUI.getThemeMode('l_') : 'l_default');
		if(!$TOP.ON)
			$POL.setNextStage(!$DAT.DATA||!$DAT.DATA['items'] ? (!$DAT.DATA?$POL.NOW:$POL.SHORT) : $POL.getNextSync());
		else if($TOP.searchCriteria())
			$CFG.buttonToggle(true);
		if($hasSettings() && $DAT.DATA && $DAT.DATA['marquee'] && $DAT.DATA['marquee'].length > 1)
			$MRQ.update();
		else
			$MRQ.initiate();
		$MRQ.intervalReset();
		if($isVisible())
			$NFY.playAudio(_audioTest);
		$GUI.contentTableUpdate(true);
		if($isMobile(true) || _settings[$ANI.ID])
			$ANI.toggle(false, null);
	},
	fastSplash: () => {
		if($ANI.COMPLETE || !$DAT.DATA) return;
		$ANI.reset('l_logo', 'l_logo 0.5s ease 1 normal 0.5s forwards');
		$ANI.reset('l_fixed', 'l_fixed 0.5s ease 1 normal forwards');
		$ANI.reset('l_marquee_container', 'l_marquee_container 0.5s ease forwards');
		$ANI.complete(true);
		$ANI.updateFlash();
	},
	updateFlash: nextPollMS => {
		if(!$ANI.COMPLETE || !$T('path')) return;
		for(let t=0,i=0; t < _T.length; t++) {
			const path=_T[t], animate=path.lastElementChild, flashable=path.classList.contains('l_logo_worm_flashable');
			if(animate.getAttribute('begin')) {
				animate.setAttribute('begin', '');
				animate.beginElement();
				continue;
			}
			animate.setAttribute('values', (flashable?'1;':'0;') + animate.getAttribute('values').replace(/^.+;([0-9\.]+)$/, '$1')); 
			path.appendChild(animate);
			if(flashable)
				i += 0.1;
			animate.beginElementAt(i);
		}
		if($TOP.LOG)
			$TOP.WS.connect();
		else if(nextPollMS && nextPollMS > 0)
			$POL.setNextStage(nextPollMS, true);
		else
			return;
		$scrollToTop();
	},
	toggle: (explicit, saveSettings) => {
		const animations = (typeof explicit == 'boolean' ? explicit : !!$E($ANI.ID));
		if(saveSettings)
			$CFG.set($ANI.ID, !animations);
		$D.body.id = animations ? 'l_n' : $ANI.ID;
		if($ANI.COMPLETE)
			$D.body.className = $D.body.id;
		if($HST.IDX >= 0)
			$HST.updateStageData();
		else if(animations)
			$MRQ.flash(`Full animation experience has been restored${saveSettings?' and saved':''}.`);
		$POL.progressReset();
		$keyModeReset();
		$scrollToTop();
		$EVT.scroll();
	},
	reset: (idOrElement, animation) => {
		const el=(typeof idOrElement=='string' ? $E(idOrElement) : idOrElement);
		el.style.animation = 'none';
		void el.offsetHeight;
		el.style.animation = animation;
	},
	disableIfUnderFPS: (ms, fps, attempt) => {
		if(!$GUI.FRAMES) {
			if(!fps || $E($ANI.ID) || _settings[$ANI.ID] || $TOP.LOG || $isMobile(true) || !['requestAnimationFrame','performance'].every(fn=>$W[fn]))
				return($removeFunction('ANI', 'disableIfUnderFPS'));
			$GUI.FRAMES = {'fps':fps, 'duration':ms/1000, 'stop':performance.now()+ms, 'frames':0, 'attempt':attempt>0?attempt:0};
		}
		else if(!fps)
			$GUI.FRAMES.frames++;
		else
			return;
		if($GUI.FRAMES.stop > ms)
			$W.requestAnimationFrame($ANI.disableIfUnderFPS);
		else if($GUI.FRAMES.duration > 0 && ($GUI.FRAMES.frames/$GUI.FRAMES.duration) < $GUI.FRAMES.fps) {
			$ANI.toggle(false, null);
			$MRQ.flash('Slow graphics detected, disabling most animations.  Use the <i>tab</i> key to re-enable.');
			$removeFunction('ANI', 'disableIfUnderFPS');
		}
		else if(--$GUI.FRAMES.attempt > 0) {
			$GUI.FRAMES.frames = 0;
			$GUI.FRAMES.stop = performance.now() + ($GUI.FRAMES.duration * 1000);
			$W.requestAnimationFrame($ANI.disableIfUnderFPS);
		}
		else
			$GUI.FRAMES = null;
	}
},

/*************************************************************************************************\
\*******  SETTINGS & GENERAL USER CONFIGURATION  ****************************  [ $CFG.* ]  *******/
CFG: {
	setup: () => {
		$GUI.setStage($ASK.ON ? 'ask' : 'bid');
		if($TOP.ON) $CFG.buttonTextToggle(false);
		$CFG.load(false);
	},
	load: passive => {
		$ANI.ID = $isMobile(true) ? 'l_nam' : 'l_na';
		let now=new Date(), exs=null, settings=null;
		if(!passive)
			$CFG.buttonToggle(false, true);
		if(!Object.keys(_settingsBase).length)
			_settingsBase = $cloneObject(_settings);
		if(!passive && localStorage.getItem('larval') && (settings=JSON.parse(localStorage.getItem('larval')))) {
			if(settings['l_version'] == _settings['l_version'])
				_settings = settings;
			else 
				$CFG.clear('Version change.');
		}
		if((exs=_settings['l_exceptions']) && (exs=exs.split(/\s+/)) && exs.shift()==now.toLocaleDateString())
			$NFY.EXCEPTIONS = exs.filter(Boolean);
		else
			$CFG.set('l_exceptions', '', true);
		$DAT.getSymbolsOnTop();
		$CFG.tabUpdateUI();
		for(let key of Object.keys(_settings)) {
			if($E(key) && _E.type == 'checkbox')
				_E.checked = _settings[key];
			else if(_E && _E.type == 'range')
				_E.value = (typeof _settings[key]=='number' ? _settings[key] : 0);
		}
/*
		for(let key of Object.keys(_settingsSelectedTab)) {
			if(!$E(key) || !_E['type'])
				continue;
			else if(_E.type == 'checkbox')
				_E.checked = _settingsSelectedTab[key];
			else if(_E.type == 'range')
				_E.value = (typeof _settingsSelectedTab[key]=='number' ? _settingsSelectedTab[key] : 0);
		}
*/
		for(let id of ['l_range_bids','l_range_mins','l_range_len'])
			$CFG.updateRange(id);
	},
	set: (name, value, passive, tab) => {
		if(tab)
			_settings[tab][name] = value;
		else if(_settingsSelectedTab && typeof _settingsSelectedTab[name] != 'undefined')
			_settingsSelectedTab[name] = value;
		else
			_settings[name] = value;
		if(!passive || $hasSettings())
			localStorage.setItem('larval', JSON.stringify(_settings));
		return(value);
	},
	clear: message => {
		$MRQ.flash('Clearing local settings'+(message?`: <i class="l_marquee_alt_padded">${message}</i>`:'...'));
		localStorage.clear();
		_settings = $cloneObject(_settingsBase);
		$CFG.load(true);
		$CFG.tabUpdateUI();
		$GUI.contentTableUpdate(false);
	},
	change: e => { 
		const context = (e&&e.target) ? e.target : null;
		for(let inputs=$T('input'), i=0; i < inputs.length; i++) {
			let input=inputs[i];
			if(input.type == 'checkbox')
				$CFG.set(input.id, input.checked);
			else if(input.type == 'range' && !input.disabled)
				$CFG.set(input.id, parseInt(input.value,10));
		}
		if(context && context.id == 'l_audible' && context.checked)
			$NFY.playAudio(_audioTest);
		$CFG.tabUpdateUI();
		$GUI.contentTableUpdate(false);
	},
	updateRange: idOrEvent => {
		let id='';
		if(typeof idOrEvent == 'string')
			id = idOrEvent;
		else if(typeof idOrEvent == 'object' && idOrEvent.target && idOrEvent.target.id)
			id = idOrEvent.target.id;
		const input=$E(id), display=$E(`${id}_display`);
		if(!input || !display) return;
		display.innerHTML = input.value;
	},
	updateAudio: on => $MRQ.flash(`Audible notifications: <i class="l_marquee_alt_padded">${$CFG.set('l_audible',($E('l_audible').checked=on))?'Enabled':'Disabled'}</i>`),
	updateAudioVolume: boolOrInt => {
		let audios=[_audioAlert,_audioTest], volume=audios[0].volume||0;
		if(typeof boolOrInt=='boolean')
			volume += (boolOrInt ? 0.1 : -0.1);
		else if(typeof boolOrInt=='number')
			volume = (boolOrInt > 1 ? boolOrInt/100 : boolOrInt);
		if(volume > 1 || 0 > volume)
			$MRQ.flash(`Volume is already set to its ${volume<0?'lowest':'highest'} value.`);
		else {
			audios.forEach(a => a.volume = volume);
			$MRQ.flash(`Changed audio volume to: <i class="l_marquee_alt_padded">${Math.round(volume*100,0)}%</i>` + (!$E('l_audible').checked?' (audio is disabled)':$NFY.playAudio(_audioTest)||''));
		}
	},
	tabUpdateUI: () => _assetTypes.forEach(type => $E(type).classList[_settings[type]['l_show']?'add':'remove']('l_show')),
	tabSelect: el => {
		const id=(el?el.id:_settingsSelectedTabName);
		if(!id || $TOP.ON) return;
		if($E(_settingsSelectedTabName))
			_E.classList.remove('l_tab_selected');
		if($E(id))
			_E.classList.add('l_tab_selected');
		_settingsSelectedTab = _settings[_settingsSelectedTabName=id];
		$CFG.load(true);
		$CFG.tabUpdateUI();
	},
	buttonTextToggle: opened => $E('l_settings_button').innerHTML = (opened?`&#9660; ${$TOP.ON?'search':'settings'} &#9660;`:`&#9650; ${$TOP.ON?'search':'settings'} &#9650;`),
	buttonToggle: (direction, force) => {
		if(!$E('l_control') && ($DAT.DATA||force))
			return(false);
		else if(typeof _E.dataset.opened == 'undefined' || !$ANI.COMPLETE)
			return($E('l_control').dataset.opened='');
		const isOpen=!!$E('l_control').dataset.opened, forceDirection=(typeof direction=='boolean' ? direction : !isOpen);
		if(typeof forceDirection=='boolean' && forceDirection === isOpen && !force)
			return(false);
		_E.dataset.opened = (isOpen?'':'true');
		_E.style.height = (isOpen?'0':$E('l_control_table').offsetHeight)+'px';
		$CFG.buttonTextToggle(!isOpen);
		return(true);
	}
},

/*************************************************************************************************\
\*******  MODEL & DATA "STAGE" LOGIC  ***************************************  [ $DAT.* ]  *******/
DAT: {
	MODE: 'bid', DATA: null, SORT: 0, LAST: 0, ON_TOP: {}, FETCHING: null, TIMEOUT: null,

	setup: () => void(0),
	setStage: stageData => {
		if(!$DAT.DATA)
			$E('l_fixed').style.filter = 'grayscale(0%)';
		stageData['items'].forEach((r,i) => {
			if(!stageData['items'][i][$LTMU])
				stageData['items'][i][$LTMU] = stageData['items'][i][$TMU];
			if(!stageData['items'][i][$LTME])
				stageData['items'][i][$LTME] = stageData['items'][i][$TME];
		});
		$DAT.DATA = $DAT.vpmStage(stageData);
		$GUI.setSpread(stageData ? stageData['spreads'] : null);
		$GUI.TABLE_SOFT_LIMIT = Math.abs($GUI.TABLE_SOFT_LIMIT);
		if($GUI.setTheme($GUI.getThemeMode()) !== false && $Q('meta[name="theme-color"]'))
			_Q.setAttribute('content', _themes[_theme][_themeBGColorIndex]);
		if(!$TOP.ON && location.pathname.length > 1 && $W.history && $W.history.replaceState)
			$W.history.replaceState({}, null, '/');
	},
	sortStage: updateView => {
		if($DAT.DATA && $DAT.SORT) {
			$DAT.DATA.related = null;
			if(!$DAT.DATA.itemsImmutable)
				$DAT.DATA.itemsImmutable = $cloneObject($DAT.DATA.items);
			$DAT.DATA.items = $DAT.DATA.items.sort((a, b) => {
				let column = Math.abs($DAT.SORT) - ($ASK.ON?2:1);
				if(a[column] === null || a[column] === false || a[column] === undefined)
					return 1;
				else if(b[column] === null || b[column] === false || b[column] === undefined)
					return -1;
				else if(typeof a[column] != typeof b[column])
					return $DAT.SORT < 0 ? (typeof a[column]=='number'?1:-1) : (typeof a[column]=='number'?1:-1);
				else if(typeof a[column] == 'object' && Array.isArray(a[column]))
					return $DAT.SORT < 0 ? a[column].length-b[column].length : b[column].length-a[column].length;
				else if(typeof a[column] == 'string')
					return $DAT.SORT < 0 ? b[column].toUpperCase().localeCompare(a[column].toUpperCase()) : a[column].toUpperCase().localeCompare(b[column].toUpperCase());
				else if(typeof a[column] == 'number')
					return $DAT.SORT < 0 ? a[column]-b[column] : b[column]-a[column];
			});
		}
		if(updateView)
			$GUI.contentTableUpdate(false);
	},
	setStageSort: column => {
		if($DAT.SORT == -column || !column || column > $E('l_content_table').getElementsByTagName('th').length) {
			if($DAT.DATA.itemsImmutable)
				$DAT.DATA.items = $cloneObject($DAT.DATA.itemsImmutable);
			$DAT.SORT = 0;
		}
		else if($DAT.SORT == column)
			$DAT.SORT = -column;
		else
			$DAT.SORT = column;
		$DAT.sortStage(true);
		if(!$isSafari())
			$E('l_content_table').classList.add('l_content_table_notify_'+Math.abs($DAT.SORT));
	},
	vpmStage: stageData => {
		const vpm=_settings['l_vpm'];
		if(!stageData || !(stageData['vpm'] ^ vpm))
			return(stageData);
		let stageTime=new Date(stageData['ts']*1000), minutesSinceOpen=0, minutesInADay=1440, args;
		if(!stageData['afterhours'])
			args = {'hourOffset':9.5, 'maxMinutes':390};
		else if(stageTime.getHours() < 10)
			args = {'hourOffset':7,   'maxMinutes':150};
		else
			args = {'hourOffset':16,  'maxMinutes':240};
		if((minutesSinceOpen=(stageTime.getHours()-args.hourOffset)*60+stageTime.getMinutes()) > args.maxMinutes)
			minutesSinceOpen = args.maxMinutes;
		for(let i=0; i < stageData['items'].length; i++) { 
			const minutes = (stageData['items'][i][$DOM][0]==_char['crypto'] ? minutesInADay : minutesSinceOpen);
			[$AGE,$AGE5].forEach(column => {
				if(typeof stageData['items'][i][column] != 'number')
					return;
				else if(minutes < 1 || stageData['items'][i][column] < 1)
					stageData['items'][i][column] = 0;
				else if(vpm)
					stageData['items'][i][column] = Math.round(stageData['items'][i][column] / minutes);
				else
					stageData['items'][i][column] *= minutes;
			});
		}
		stageData['vpm'] = vpm;
		return(stageData);
	},
	toggleStage: () => {},
	editSymbolsOnTop: () => {
		let symbols=_settings['l_symbols_on_top'];
		if((symbols=prompt("Enter symbols you would like to have sticky on top: \n[NOTE: alt-click rows to individually add or remove]", symbols?symbols:'')) === null)
			return;
		$DAT.setSymbolsOnTop(null, true, false);
		$DAT.setSymbolsOnTop(symbols, false, true);
	},
	delSymbolFromTop: sym => [sym,sym+'+',sym+'-'].forEach(sym => delete $DAT.ON_TOP[sym]),
	addSymbolToTop: sym => sym[0]==_char['currency'] ? ($DAT.ON_TOP[sym]=$DAT.ON_TOP[sym+'+']=$DAT.ON_TOP[sym+'-']=sym) : $DAT.ON_TOP[sym]=sym,
	getSymbolsOnTop: () => {
		if(Object.keys($DAT.ON_TOP).length)
			return($DAT.ON_TOP);
		$DAT.ON_TOP = {};
		let savedSymbols=_settings['l_symbols_on_top'];
		if(savedSymbols && (savedSymbols=savedSymbols.match(/[\^\*\$\~\@]?[A-Z0-9]+/ig)))
			savedSymbols.forEach(sym => $DAT.addSymbolToTop(sym));
		return($DAT.ON_TOP);
	},
	setSymbolsOnTop: (symbols, removeOrToggle, updateView) => {
		if($TOP.ON) return;
		const remove=(removeOrToggle===true), toggle=(removeOrToggle===null);
		let msg='', orderedTopListStr='', orderedTopList, savedSymbols, onTopDiff=$U(Object.values($DAT.ON_TOP)).length;
		if(!symbols && remove)
			$DAT.ON_TOP = {};
		else if(symbols && (savedSymbols=($TOP.ON?symbols:symbols.toUpperCase()).match(/[\^\*\$\~\@]?[A-Z0-9]+/ig)))
			savedSymbols.forEach(sym => (remove||(toggle&&$DAT.ON_TOP[sym])) ? $DAT.delSymbolFromTop(sym) : $DAT.addSymbolToTop(sym));
		orderedTopList = $U(Object.values($DAT.ON_TOP)).sort((a, b) => a.localeCompare(b));
		orderedTopListStr = orderedTopList.join(', ').trim(', ');
		$CFG.set('l_symbols_on_top', orderedTopListStr);
		if(!updateView) return;
		onTopDiff -= orderedTopList.length;
		if(!orderedTopListStr)
			msg = 'Your on top list is empty, alt-click a row below to add a symbol.';
		else if((savedSymbols && savedSymbols.length > 1) || Math.abs(onTopDiff) != 1)
			msg = 'Symbols on top: ';
		else if(onTopDiff > 0)
			msg = `<i>${symbols}</i> removed from top: `;
		else
			msg = `<i>${symbols}</i> added to top: `;
		if(orderedTopListStr)
			msg += `<i class="l_marquee_alt_padded">${orderedTopListStr}</i>`;
		$MRQ.flash(msg);
		$GUI.contentTableUpdate(false);
	},
	setURLFormat: (key, saveSettings) => {
		if(!_keyMap[key]) return;
		$GUI.KEY_MAP_IDX = key;
		const domain=new URL(_keyMap[$GUI.KEY_MAP_IDX][$KSTK]), display=(domain&&domain.hostname?domain.hostname:url);
		if(saveSettings) {
			$CFG.set('l_keymap_index', $GUI.KEY_MAP_IDX);
			$MRQ.flash(`Links will now permanently direct to <i>${display}</i> by default.`);
		}
		else
			$MRQ.flash(`Links will now direct to <i>${display}</i> for this session, hold down <i>shift</i> to make it permanent.`);
	}
},

/*************************************************************************************************\
\*******  GUI & GENERAL VIEW LOGIC  *****************************************  [ $GUI.* ]  *******/
GUI: {
	MAPS: {'bid':[],'ask':[]}, MAP: null,
	KEY_MAP_IDX_DEFAULT: 'XX', KEY_MAP_IDX: null, KEY_ROW: 0,
	TABLE_SOFT_LIMIT: 100, TABLE_ROWS_IN_VIEW: 10,
	FRAMES: null, SWIPE_START: null,

	setup: () => {
		Object.keys(_enumMap).forEach(enumGroup => { 
			for(let i=0, cellKeys=Object.keys(_enumMap[enumGroup]); i < cellKeys.length; i++) {
				const key=cellKeys[i], globalKey='$'+key;
				if(typeof _enumMap[enumGroup][key] == 'number')
					$W[globalKey] = _enumMap[enumGroup][key];
				else {
					$W[globalKey] = i;
					$GUI.MAPS[enumGroup].push(_enumMap[enumGroup][key]);
				}
			}
		});
		$GUI.MAP = $GUI.MAPS[$DAT.MODE];
		$D.body.id = $D.body.className = 'l_n';
		if($D.domain.match(/stage/i))
			$E('l_root').classList.add('l_stage');
		if($E('l_awaiting_data'))
			_E.innerText = _E.title;
		if(!($GUI.KEY_MAP_IDX=_settings['l_keymap_index']))
			$GUI.KEY_MAP_IDX = $GUI.KEY_MAP_IDX_DEFAULT;
		for(let key in _keyMap) {
			for(let type of [$KCRP,$KFTR,$KCUR]) {
				if(!_keyMap[key][type])
					_keyMap[key][type] = _keyMap[$GUI.KEY_MAP_IDX_DEFAULT][type];
			}
		}
		setInterval($GUI.dynamicUpdate, 60000);
	},
	setStage: set => $GUI.MAP = $GUI.MAPS[$DAT.MODE=set],
	forceRedraw: el => el && (el.style.transform='translateZ(0)') && void el.offsetHeight,
	setTheme: name => (_theme!=name && _themes[name] && _themes[_theme=name].forEach((color,i) => $D.body.style.setProperty(`--l-color-${i}`,color))),
	getThemeMode: prefix => $DAT.DATA ? ((prefix?prefix:'') + (['afterhours','bloodbath','top'].find(key => $DAT.DATA[key]) || 'default')) : null,
	setThemeRandom: message => {
		_theme = '', _themes['random'] = _themes['default'].map(() => '#'+(2**32+Math.floor(Math.random()*2**32)).toString(16).substr(-6));
		$GUI.setTheme('random');
		$MRQ.flash(message, false, 20000);
	},
	menuClick: sub => {
		const url=`//${sub=='www'?'':sub+'.'}${$M(/(stage\.)?[^.]+\.[A-Z0-9]+$/i,$D.domain)?_M[0]:'larval.com'}`, win=$W.open(url,sub);
		if(win) win.focus();
		else location.href = url;
	},
	broadBehaviorToggle: topMode => {
		if(!$ANI.COMPLETE)
			$ANI.fastSplash(true);
		else if(topMode) {
			if($E('l_top_search').disabled) return;
			else if($TOP.LOG) $ANI.updateFlash();
			else if($CFG.buttonToggle(false)) $TOP.searchRun('');
			else $CFG.buttonToggle(true);
			$MRQ.update();
		}
		else if($scrollToTop() || $CFG.buttonToggle(false) || $HST.gotoStageData(0)) return;
		else $POL.forceNextStage();		
	},
	relatedToggle: idx => {
		let mainRow=$DAT.DATA.items[idx], symbols=[mainRow[$DOM]].concat(mainRow[$REL]), indices=($DAT.DATA.related&&$DAT.DATA.related[0]==idx?null:[idx]);
		if(indices) {
			$DAT.DATA.items.forEach((row, idx) => {
				if($I(symbols, row[$DOM]) > 0)
					indices.push(idx);
			});
			if(indices.length < 2)
				indices = null;
		}
		$DAT.DATA.related = indices;
		$GUI.contentTableUpdate();
	},
	vpmToggle: () => {
		if(!$DAT.DATA || (_settings['l_vpm'] === null && !confirm('Toggle from "volume per day" to the average "volume per minute" (VPM)?')))
			return;
		$CFG.set('l_vpm', !_settings['l_vpm']);
		$DAT.DATA = $DAT.vpmStage($DAT.DATA);
		$GUI.contentTableUpdate();
	},
	getMenu: () => $E('l_menu_left').innerHTML,
	setMenu: items => (items&&items.length) ? ($E('l_menu_left').innerHTML = $E('l_menu_right').innerHTML = items.map(x => `<span class="l_menu_link">${x}</span>`).join('')) : null,
	setSpread: spreads => {
		const items=(spreads?spreads.map(x => `<div class="${x[2]?'l_spread_link':'l_spread_nolink'}" data-ref="${x[2]?x[2]:''}" style="border-image:linear-gradient(90deg, var(--l-color-3) ${x[1]-1}%, var(--l-color-6) ${x[1]}%, var(--l-color-5) ${x[1]+1}%) 1 1">${$H(x[0])}</div>`):[]);
		$E('l_spread').style.opacity = items.length ? '1' : '0.25';
		if(!items.length)
			return;
		items.splice(Math.floor(items.length/2), 0, '<div class="l_spread_separator"></div>'); 
		_E.innerHTML = items.join('');
	},
	cellRollover: (row, primary, secondary, staticPrimary) => {
		let cell='<div class="l_hover_container">', hasSecondary=(row[secondary]||staticPrimary);
		if(hasSecondary)
			cell += (row[secondary] ? `<i class="l_hover_active">${$GUI.cell(row,secondary)}</i><i class="l_hover_inactive">` : `<i class="l_hover_inactive">`);
		cell += $GUI.cell(row, !row[primary] ? secondary : primary);
		if(hasSecondary)
			cell += '</i>';
		cell += '</div>';
		return(cell);
	},
	cellTopRollover: (row, primary, secondary) => {
		let cell='<div class="l_hover_container">', hasSecondary=(row[$THST]&&row[$THST][0][secondary]);
		if(hasSecondary)
			cell += `<i class="l_hover_active">${$GUI.cell(row[$THST][0],secondary)}</i><i class="l_hover_inactive">`;
		cell += $GUI.cell(row, !row[primary]&&secondary==$HMOD ? '0%' : primary);
		if(hasSecondary)
			cell += '</i>';
		cell += '</div>';
		return(cell);
	},
	cell: (row, type, idx) => row[type] && $GUI.MAP[type] ? $GUI.MAP[type]({'val':row[type], 'row':row, 'type':type, 'idx':typeof(idx)=='number'?idx:-1}) : (typeof type=='string'?type:$F('f_empty_cell')),
	contentTableRoll: roll => $E('l_content_table').classList[roll?'add':'remove']('l_content_table_alt_display'),
	contentTableRowPopout: row => $F(''),
	contentTableUpdateRowCountThatAreInView: () => {
		let rows=$E('l_content_table').getElementsByTagName('tr'), total=-5;
		for(let i=0; i < rows.length; i++) {
			const box=rows[i].getBoundingClientRect();
			if(box.top < $W.innerHeight && box.bottom >= 0)
				total++;
		}
		if(total < 10)
			total = 10;
		$GUI.TABLE_ROWS_IN_VIEW = total;
		return(total);
	},
	contentTableUpdate: (doNotify, doNotResetKeyRow) => {
		if(!$DAT.DATA || !$ANI.COMPLETE) return;
		$E('l_menu').className = ($ANI.COMPLETE && !$isWeekend() ? $GUI.getThemeMode('l_') : 'l_default');
		let i=-1, r=-1, rowRules={}, notifyRows=[], indices=[], notify=false, notifyRelated=false, visibleRows=0, onTop={}, htmlRow='', htmlPriority='', htmlNew='', htmlNormal='', html='<tr>', stockAssetType='l_bids';
		const columns = ($ASK.ON ? ['type', 'domain','price','change'] : ['site','domain','age','traf<i>fic</i>','bids','price','updated','end']);
		$E('l_root').classList[$DAT.DATA['locked']?'add':'remove']('l_locked');
		if(_assetTypes[0] != stockAssetType) {
			if($E(_assetTypes[0]))
				_E.id = stockAssetType;
			if(_settingsSelectedTabName == _assetTypes[0])
				_settingsSelectedTabName = stockAssetType;
			_assetTypes[0] = stockAssetType;
			$CFG.tabSelect();
		}
		if(!_settingsSelectedTabName) {
			if(!(_settingsSelectedTabName=_assetTypes.find(assetType => _settings[assetType]['l_show'])))
				_settingsSelectedTabName = _assetTypes[0];
			$CFG.tabSelect();
		}
		for(let assetType of _assetTypes) {
			const thisType=_settings[assetType];
			rowRules[assetType] = {
				'bids': thisType['l_range_bids'],
				'mins': thisType['l_range_mins'],
				'len': thisType['l_range_len'],
			}
		}
		for(let c=1,className=''; c <= columns.length; c++) {
			className = 'l_content_table_header';
			if($DAT.SORT == c)
				className += ' l_content_table_header_selected';
			else if($DAT.SORT == -c)
				className += ' l_content_table_header_selected_reverse';
			html += `<th id="l_content_table_header_${c}" class="${className}" data-ref="${c}" data-alt="none">${columns[c-1]}</th>`;
		}
		html += '</tr>';
		if(doNotify)
			$NFY.clear();

		while((indices.length > 0 && (i=r=indices.pop())) || ++i < $DAT.DATA['items'].length) {
			const row=$DAT.DATA['items'][i], rowType='l_bids', isStock=(_I<0), notifyExcept=($I($NFY.EXCEPTIONS,row[$DOM])>=0), isOnTop=(row[$AID][0]=='+'), minutesRemaining=$minutesRemaining(row[$TME]);
			let rowClass=rowType, notifyControl='', historyClass=($TOP.LOG?'':'l_history_toggle'), [tld,domain]=row[$ASK.ON?$ADOM:$DOM].split('.').reverse();
			if(typeof _settings['l_tld_'+tld] == 'undefined')
				tld = 'else';
			notify = (!notifyExcept && isOnTop && _settings['l_tld_'+tld] && (!_settings['l_range_bids']||_settings['l_range_bids']>=row[$BID]) && (!_settings['l_range_mins']||_settings['l_range_mins']>=minutesRemaining) && (!_settings['l_range_len']||_settings['l_range_len']>=domain.length) && !(!_settings['l_numbers']&&domain.match(/[0-9]/)) && !(!_settings['l_hyphens']&&domain.match('-')));
			if(notify) {
				rowClass += ` l_notify_top_up`;
				notifyControl = $F('f_class_title_display', ['l_notify_disable', `Disable ${$GUI.cell(row,$DOM)} notifications for today`, 'x']);
			}
			else if(isOnTop)
				rowClass += ' l_top_highlight';
			if(notifyExcept)
				notifyControl = $F('f_class_title_display', ['l_notify_enable', `Re-enable ${$GUI.cell(row,$DOM)} notifications`, '&#10003;']);
			if($DAT.DATA.related && $DAT.DATA.related[0] == i) {
				indices = indices.concat($DAT.DATA.related.slice(1));
				if(i+1 < $DAT.DATA['items'].length)
					indices.unshift(i+1);
				notifyRelated = notify || isOnTop;
			}
			if(indices.length > 0) {
				rowClass += ' l_linked';
				if(notifyRelated)
					notify = notifyRelated;
			}
			if($ASK.ON)
				htmlRow = `<tr class="${rowClass}" data-ref="${i}">
					<td>BIN</td>
					<td class="l_static">${$GUI.cell(row,$ADOM)}</td>
					<td>${$GUI.cell(row,$APRC)}</td>
					<td>${$GUI.cell(row,$ACHG)}</td>
					</tr>`;
			else
				htmlRow = `<tr class="${rowClass}" data-ref="${i}">
					<td>${notifyControl}${$GUI.cell(row,$AID)}</td>
					<td class="l_static">${$GUI.cellRollover(row,$DOM,-1,true)}</td>
					<td>${$GUI.cell(row,$AGE)}</td>
					<td>${$GUI.cell(row,$TRF)}</td>
					<td>${$GUI.cellRollover(row,$BID,$LBID)}</td>
					<td>${$GUI.cellRollover(row,$PRC,$LPRC)}</td>
					<td>${$GUI.cellRollover(row,$TMU,$LTMU)}</td>
					<td>${$GUI.cellRollover(row,minutesRemaining<60?$LTME:$TME,minutesRemaining<60?$TME:$LTME)}</td>
					</tr>`;
			if(visibleRows >= 0 && $GUI.TABLE_SOFT_LIMIT > 0 && ++visibleRows >= $GUI.TABLE_SOFT_LIMIT)
				visibleRows = -1;
			else if(notify) {
				htmlPriority += htmlRow;
				notifyRows.push(row);
			}
			else if(isOnTop)
				htmlNew += htmlRow; 
			else if(visibleRows >= 0)
				htmlNormal += htmlRow;

		}
		if(visibleRows >= 0 && $GUI.TABLE_SOFT_LIMIT > 0)
			$GUI.TABLE_SOFT_LIMIT = -$GUI.TABLE_SOFT_LIMIT;
		if(_assetTypes.every(type => !_settings[type]['l_show']))
			html += $F('f_no_results_row', ['No asset types are set to show in your settings.']);
		else if(!htmlNormal && !htmlNew && !htmlPriority && !Object.keys(onTop).length) {
			let noResults='No results found', dataWithLog=($DAT.DATA['log']?$DAT.DATA:$HST.DATA.find(d=>d['log']));
			if($TOP.LOG)
				noResults += ': Log data will appear when it becomes available.';
			else if($TOP.ON && dataWithLog && $M(/#(.+)/,dataWithLog['log']))
				noResults += `: If applicable, your query will be added to the queue. (see: <a href="//${_M[1]}">${_M[1]}</a>)`;
			html += $F('f_no_results_row', [noResults]);
		}
		else
			html += htmlPriority + htmlNew + htmlNormal;
		$E('l_more').className = $GUI.TABLE_SOFT_LIMIT > 0 ? 'l_more' : 'l_no_more';
		$E('l_content_table').className = $E('l_awaiting_data') ? '' : 'l_content_tr_fade_in';
		if(doNotify && !$isSafari())
			$E('l_content_table').classList.add('l_content_table_notify_'+Math.abs($DAT.SORT));
		$E('l_content_table').innerHTML = html;
		if($TOP.ON)
			Array.from($A('.l_top_user')).forEach(u => u.title = u.innerText);
		$GUI.contentTableUpdateRowCountThatAreInView();
		if(!doNotResetKeyRow)
			$GUI.KEY_ROW = 0;
		else
			$EVT.keydown(null);
		if(doNotify && notifyRows.length > 0)
			$NFY.notify(notifyRows);
		if(typeof $DAT.DATA['highlight']=='number')
			$HST.dropDownToggle($DAT.DATA['highlight']);
	},
	dynamicUpdate: () => {
		if(!$C('l_update'))
			return;
		for(c in _C) {
			const el = _C[c];
			if(!el || !el.dataset || !el.dataset.trUpdate)
				continue;
			el.innerHTML = $timeRemaining(el.dataset.trUpdate);
			if(el.dataset.trUpdate*1000 < Date.now())
				el.classList.add('l_past');
		}
	}
},

/*************************************************************************************************\
\*******  HISTORY & NAVIGATION LOGIC  ***************************************  [ $HST.* ]  *******/
HST: {
	DATA: [], SWAP: [], IDX: -1, NEXT: '', SESSION_ID: 0, FIRST: false,

	setup: () => {
		if($HST.SESSION_ID) return;
		$HST.push({'root':true});
		$HST.SESSION_ID = Date.now();
	},
	getForSymbol: (sym, ts) => {
		return $HST.DATA.filter(stageData => stageData['ts'] <= ts).map(history => {
			const epoch=$epochNow();
			for(row of history['items']) {
				if(row[$DOM]==sym && !$isHaltRow(row))
					return([...row, null, `~${Math.round((epoch-history['ts'])/60,0)}m&nbsp;ago`]);
			}
		}).reverse();
	},
	toSummaryString: history => {
		if(typeof history!='object' || !Array.isArray(history)) return;
		let symbols=[];
		for(let h=0; h < history.length; h++) {
			if($I(symbols, history[h][$HMOD]) < 0)
				symbols[history[h][$HILT]?'unshift':'push'](history[h][$HMOD]);
		}
		return('[<u>'+('0'+history.length).slice(-2)+'</u>] '+symbols.slice(0,8).join(', '));
	},
	push: obj => {
		if(typeof(obj)!='object' || !$W['history'] || !$W['history']['pushState']) return;
		obj['session'] = $HST.SESSION_ID;
		$W.history.pushState(obj, _title, obj['path']?obj['path']:'');
	},
	pushWithPath: obj => obj['path'] ? $HST.push(obj) : null,
	dropDownToggle: idx => (!$HST.FIRST&&!$TOP.ON&&$HST.IDX>=-1) ? $NET.getHistoryData({'dropDownIndex':idx}) : $HST.dropDown(idx),
	dropDown: idx => {
		const types=($TOP.ON?[$TSYM,$TRAT,$TPCT,$TPCR,$TSTR,$TEND]:[$BID,$PRC,$TMU,$TME]), stageRow=($DAT.DATA&&$DAT.DATA['items']&&$DAT.DATA['items'][idx]?$DAT.DATA['items'][idx]:null);
		let stageDataForSymbols=($TOP.ON?stageRow[$THST]:$HST.getForSymbol(stageRow[$DOM],$DAT.DATA['ts'])), hadHistoryDisplays=[], skipIdx=[];
		if(!stageDataForSymbols) return;
		if($A('.l_history_active'))
			hadHistoryDisplays = Array.from(_A).map(e => e.remove() || e.id);
		if($A('.l_history'))
			_A.forEach(e => e.classList.remove('l_history'));
		for(let i=0,lastBid=0; i < stageDataForSymbols.length; i++) {
			if(!stageDataForSymbols[i] || lastBid == stageDataForSymbols[i][types[0]])
				skipIdx.push(i);
			else
				lastBid = stageDataForSymbols[i][types[0]];
		}
		for(let type of types) {
			let historyId=`l_history_${idx}_${type}`, hadHistoryDisplay=($I(hadHistoryDisplays,historyId)>=0), htmlItems=[];
			if(!$Q(`[data-ref='${idx}'] td:nth-of-type(${type+1})`))
				continue;
			stageDataForSymbols.forEach((row, idx) => {
				if(row && skipIdx.indexOf(idx) < 0)
					htmlItems.push(`<div class="l_hover_container${$TOP.ON&&row[$HILT]?' l_top_searched_symbol':''}">${$GUI.cell(row,type,idx)}</div>`);
			});
			if(htmlItems.length == 0)
				htmlItems.push(`<div class="l_hover_container">${$GUI.cell(stageRow,type)}</div>`);
			_Q.classList[hadHistoryDisplay?'remove':'add']('l_history');
			if(!hadHistoryDisplay)
				_Q.insertAdjacentHTML('beforeend', `<div id="${historyId}" class="l_history_active">${htmlItems.join('')}</div>`);
		}
		if($isSafari())
			$GUI.forceRedraw($E('l_content_table'));
	},
	gotoStageData: direction => {
		let lastIndex=$HST.IDX, quiet=false;
		if($DAT.FETCHING && $DAT.FETCHING.match('history'))
			return(false);
		else if(!direction) {
			$GUI.KEY_ROW = 0;
			if($HST.IDX >= 0)
				$HST.IDX = -1;
		}
		else if(direction < 0) {
			if($HST.DATA.length < 2 || $HST.IDX < 0)
				$MRQ.flash('You are already viewing live data, use the <i>&#8656;</i> key to rewind.');
			else if($HST.IDX + 2 >= $HST.DATA.length)
				$HST.IDX = -1;
			else
				$HST.IDX++;
		}
		else if(direction > 0) {
			if(quiet=(!$HST.FIRST && $HST.IDX >= -1 && $HST.IDX == ($HST.DATA.length < 2 ? -1 : 0))) {
				$MRQ.flash('Attempting to gather recent history from the server...');
				$NET.getHistoryData();
			}
			else if($HST.IDX < 0)
				$HST.IDX = $HST.DATA.length - 2;
			else if($HST.IDX > 0)
				$HST.IDX--;
			else
				$MRQ.flash('End of history, use <i>&#8658;</i> to move forward or <i>escape</i> to exit.', true);
		}
		return(lastIndex !== $HST.IDX && $HST.updateStageData(quiet));
	},
	updateStageData: quiet => {
		const historyTotal=$HST.DATA.length-1, historyIndex=$HST.IDX<0?historyTotal:$HST.IDX;
		const stageData=$cloneObject($HST.DATA[$HST.IDX >= 0 ? $HST.IDX : historyTotal]);
		$DAT.setStage(stageData);
		$DAT.sortStage(true);
		if(quiet || !$DAT.DATA)
			return(false);
		const minutesAgo=Math.round(($epochNow()-$DAT.DATA['ts'])/60,0);
		if(historyIndex == historyTotal)
			$MRQ.flash('All caught up, exiting history mode...', true);
		else
			$MRQ.flash(`Rewound to ${$epochToDate($DAT.DATA['ts'])}: <i class='l_marquee_alt_padded'>${minutesAgo} minutes ago</i>${!$HST.FIRST?'':' ['+$P(historyTotal-historyIndex,historyTotal)+'%]'}`, true);
		return(true);
	}
},

/*************************************************************************************************\
\*******  MARQUEE LOGIC  ****************************************************  [ $MRQ.* ]  *******/
MRQ: {
	HIGHLIGHT: 0, MESSAGE: '', INTERVAL: null, TIMEOUT: null,

	setup: () => void(0),
	initiate: html => {
		const marquee=$E('l_marquee'), marqueeContent=$E('l_marquee_content'), marqueeContentClone=$E('l_marquee_content_clone');
		if(html) marqueeContent.innerHTML = html;
		marqueeContentClone.innerHTML = '';
		void marquee.offsetWidth;
		const fullWidthPreClone=marquee.scrollWidth, viewWidthPreClone=marquee.offsetWidth;
		marqueeContentClone.innerHTML = marqueeContent.innerHTML;
		$D.documentElement.style.setProperty('--l-marquee-start', `-${viewWidthPreClone}px`);
		$D.documentElement.style.setProperty('--l-marquee-end', `-${fullWidthPreClone}px`);
		$ANI.reset(marquee, `l_marquee ${$MRQ.lengthToSeconds()}s linear infinite`);
		const secsToHighlight = $MRQ.secondsToLastHighlight();
		if(secsToHighlight > 0 && $ANI.COMPLETE && !$MRQ.MESSAGE && $DAT.LAST > $MRQ.HIGHLIGHT) {
			if(!$isVisible())
				$updateTitleWithPrefix(_char['updown']);
			else {
				const repeatCount=Math.floor(secsToHighlight/3), highlightElement=($isMobile(false)?'l_menu':'l_marquee_container');
				$ANI.reset(highlightElement, `${highlightElement}_highlight 3s ease-in forwards ${repeatCount<3?3:repeatCount}`);
				$MRQ.HIGHLIGHT = $DAT.LAST;
			}
		}
		if($DAT.DATA && $DAT.DATA['menu'] && $DAT.DATA['menu'].length && !$GUI.getMenu())
			setTimeout(() => $GUI.setMenu($DAT.DATA['menu']), 500);
	},
	update: (resetInterval, passive) => {
		if(!$ANI.COMPLETE || !$DAT.DATA || $TOP.LOG || !$DAT.DATA['marquee'] || $DAT.DATA['marquee'].length < 2 || (!$TOP.ON&&passive&&$E('l_marquee_about')))
			return;
		let html=$F('f_marquee_blink_wide'), itemHtml='', rank=0, maxRank=20, topType='', lastTopType='';
		if($TOP.ON)
			itemHtml = `<div class="l_marquee_warning"><i>${_char['warning']} LARVAL . TOP ${_char['warning']}</i> <a href="//top.larval.com" target="_blank">top.larval.com</a> is a sentiment tracker for <a href="//stocktwits.com" target="_blank">stocktwits.com</a>, you can change the <span>.com</span> to <span>.top</span> (<a href="//stocktwits.top" target="_blank">stocktwits.top</a>) with most urls to quickly view and automatically queue monitoring of a user's most recent applicable posts.</div>`;
		else
			_warnings.filter(Boolean).forEach(msg => itemHtml += `<div class="l_marquee_warning"><i>${_char['warning']} WARNING ${_char['warning']}</i>${msg}</div> `);
		if(itemHtml)
			html = itemHtml + _F;
		for(let i=0; i < $DAT.DATA['marquee'].length; i++) {
			let item=$DAT.DATA['marquee'][i];
			if(item.length > 2 && typeof item[2]=='string' && typeof item[1]!='string') {
				topType = 'index';
				itemHtml = `<div class="l_marquee_link" data-ref="${item[0]}"><i class='l_marquee_alt_padded_right'>${$H(item[2])}</i>`;
				if(item.length > 3)
					itemHtml += `<div class="l_marquee_highlight" data-ref="${item[0]}">&#10094;<i>${item[3]<0?'&#9660;':'&#9650;'} ${Math.abs(item[3]).toFixed(2)}%</i> &#10095; &#10140;</div> `;
				itemHtml += `${item[1]<0?'&#9660;':'&#9650;'} ${Math.abs(item[1]).toFixed(2)}%</div> `;
			}
			else if(item.length > 1 && typeof item[1]=='string') {
				topType = 'continue';
				itemHtml = `<div class="l_marquee_talk" data-ref="${item[0]}"><i class='l_marquee_alt_padded_right_talk'>@${item[0].replace(/[^A-Z0-9_].+/i,'')}</i> `;
				if(item.length > 2)
					itemHtml += `<div class="l_marquee_highlight_talk" data-ref="${item[0]}"> &#10094; <i>${$H(item[2])}</i> &#10095; &#10140;</div> `;
				itemHtml += `${item[1]}</div> `;
			}
			else if(item[0][0] != _char['crypto'] || $isShowing('l_crypto')) {
				topType = 'default';
				if(!rank && i >= 5)
					maxRank /= 2;
				itemHtml = `<div class="l_marquee_link" data-ref="${item[0]}"><i class='l_marquee_alt_padded_right'>#${++rank}</i>${item[0]} &#177; `;
				if(item.length > 2)
					itemHtml += `<div class="l_marquee_highlight" data-ref="${item[0]}">&#10094;<i>${item[2]<0?'&#9660;':'&#9650;'} ${Math.abs(item[2]).toFixed(2)}%</i> &#10095; &#10140;</div> `;
				itemHtml += `${item[1]}%</div> `;
				if(rank >= maxRank)
					lastTopType = topType = 'break';
			}
			else
				continue;
			if(itemHtml)
				html += (i&&($TOP.ON||lastTopType!=topType)?_F:'') + itemHtml;
			if(topType == 'continue') continue;
			if(topType == 'break') break;
			lastTopType = topType;
		}
		$MRQ.initiate(html);
		if(resetInterval)
			$MRQ.intervalReset();
	},
	lengthToSeconds: useMS => ((($E('l_marquee_content')&&_E.clientWidth) ? (_E.clientWidth/85) : ((_E.textContent.length||100)/6)) * (useMS?1000:1)),
	secondsToLastHighlight: useMS => {
		if(!$A('#l_marquee_content .l_marquee_highlight') || _A.length < 1)
			return(0);
		else {
			const marquee=$E('l_marquee'), lastHighlightedElement=_A[_A.length-1], pixelsToLastHighlight=Math.round(lastHighlightedElement.getBoundingClientRect().x - marquee.offsetLeft + (marquee.clientWidth/2), 0);
			const pixelsPerSeconds=$E('l_marquee_content').clientWidth/$MRQ.lengthToSeconds(), secondsToLastHighlight=Math.round(pixelsToLastHighlight/pixelsPerSeconds,0);
			return(secondsToLastHighlight * (useMS?1000:1));
		}
	},
	flash: (message, priority, duration) => {
		if($MRQ.TIMEOUT)
			$MRQ.TIMEOUT = clearTimeout($MRQ.TIMEOUT);
		if($HST.IDX >= 0 && (!message || !priority))
			return;
		$MRQ.MESSAGE = message;
		if($E('l_marquee_container').style.animationName == 'l_marquee_container_highlight')
			$ANI.reset('l_marquee_container', 'l_marquee_container_normal 0s linear forwards');
		$E('l_marquee_container').classList[$E($ANI.ID)?'add':'remove']('l_na_marquee_container_override');
		$E('l_marquee_flash').innerHTML = $MRQ.MESSAGE ? $MRQ.MESSAGE : '';
		$E('l_marquee').style.display = $MRQ.MESSAGE ? 'none' : 'inline-block';
		$E('l_marquee_flash').style.display = $MRQ.MESSAGE ? 'inline-block' : 'none';
		if($MRQ.MESSAGE) {
			$scrollToTop();
			$MRQ.intervalReset();
			if(typeof duration != 'number' || duration >= 0)
				$MRQ.TIMEOUT = setTimeout($MRQ.flash, duration?duration:5000);
			$ANI.reset('l_marquee_flash', 'l_fade_in 1s ease forwards');
		}
		else {
			$E('l_marquee_container').classList.remove('l_na_marquee_container_override');
			$MRQ.update();
		}
	},
	intervalReset: () => {
		if($MRQ.INTERVAL)
			clearInterval($MRQ.INTERVAL);
		$MRQ.INTERVAL = setInterval($MRQ.update, $MRQ.lengthToSeconds(true));
	},
	hotKeyHelp: () => {
		let key, match, html=`${$F('f_marquee_blink')} The following hotkeys and gestures are available: ${_F} Use the <i class="l_marquee_alt">tab</i> key to alternate animation modes, hold <i class="l_marquee_alt">shift</i> to make it permanent. ${_F} Swipe or use <i class="l_marquee_alt">&#8644;</i> arrow keys to rewind and navigate your backlog history. ${_F} Use <i class="l_marquee_alt">&#8645;</i> arrow keys to navigate to a row and hit enter to view. ${_F} The keys <i class="l_marquee_alt">1-8</i> can be used to sort by each column.`;
		$scrollToTop();
		$MRQ.initiate(html);
		$MRQ.intervalReset();
	}
},

/*************************************************************************************************\
\*******  FETCH & NETWORK PARSING LOGIC  ************************************  [ $NET.* ]  *******/
NET: {
	URL: null, URLS: ['//stage.larval.bid', '//bid.stage.larval.com'],

	setup: () => ($M(/^[/#]*(https?|ipfs|ipns)[/=?]+([a-z0-9_.:-]+)\/?$/i,location.hash?location.hash:location.pathname) ? $NET.URLS.unshift($NET.URL=`${_M[1]}://${_M[2]}`) : $NET.orderURLSByURL(`//${$D.domain}`)) && $NET.nextURL() && $NET.getStageData(false),
	orderURLSByURL: url => $NET.URLS=($I($NET.URLS,url)>=0 ? $NET.URLS.concat($NET.URLS.splice(0,_I)) : $NET.URLS.sort((a,b) => Math.abs(a.slice(-1).charCodeAt(0)-url.slice(-1).charCodeAt(0)) - Math.abs(b.slice(-1).charCodeAt(0)-url.slice(-1).charCodeAt(0)))),
	nextURL: updateNow => $NET.URLS.push($NET.URL=$NET.URLS.shift()) && (!updateNow||!$POL.forceNextStage()),
	get: (jsonFile, callback, args) => {
		$E('l_logo').classList.add('l_net_loading');
		fetch($DAT.FETCHING=($NET.URL+jsonFile+'?ts='+new Date().getTime()+(args&&args.search?`&search=${encodeURIComponent(args.search)}`:'')))
		.then(resp => resp.json())
		.then(json => $NET.getCallback(callback, json, args))
		.catch(err => $NET.getCallback(callback, null, args));
	},
	getCallback: (callback, json, args) => ($DAT.FETCHING=$E('l_logo').classList.remove('l_net_loading')) || callback(json, args),
	getStageData: updateView => $NET.get(`/${$DAT.MODE}.json`, $NET.parseStageData, $X({'updateView':updateView,'search':$TOP.ON?$TOP.searchCriteria():''})),
	parseStageData: (json, args) => {
		let retry=0, minsOff=0;
		if(!json)
			retry = (!$DAT.DATA && $NET.nextURL()) ? $POL.NOW : $POL.SHORT;
		else if(!json['ts'] || ($HST.DATA.length > 0 && $HST.DATA[$HST.DATA.length-1]['ts'] == json['ts']))
			retry = $POL.SHORT;
		else if($HST.IDX >= 0 && !$TOP.ON)
			$HST.DATA.push($cloneObject(json));
		else {
			if(!args || !args['fromPopState'])
				$HST.pushWithPath(json);
			$DAT.setStage(json);
			$E('l_last_update').innerHTML = $epochToDate($DAT.LAST=$DAT.DATA['ts']);
			if(!$hasSettings() && $HST.DATA.length==0) {
				if($DAT.DATA['afterhours']=='idle')
					$CFG.set('l_show', true, true, 'l_crypto');
				else if($DAT.DATA['afterhours']=='futures') {
					$CFG.set('l_show', true, true, 'l_futures');
					$CFG.set('l_show', true, true, 'l_currency');
				}
				$CFG.tabUpdateUI();
			}
			$HST.DATA.push($cloneObject($DAT.DATA));
			$DAT.sortStage(false);
			if(args && args['updateView']) {
				$GUI.contentTableUpdate(true);
				$MRQ.update(true, true);
			}
			if($DAT.DATA['notify'] && $hasSettings())
				$MRQ.flash(`${$F('f_marquee_blink')}<span id="l_marquee_notify">${$DAT.DATA['notify']}</span>${_F}`, false, 8000);
			else if($DAT.LAST && !$TOP.ON && (minsOff=Math.floor(($DAT.LAST-Date.now()/1000)/60,0)) > 9)
				$MRQ.flash(`Your local clock is <i>${minsOff}</i> minutes ahead of the server.`);
			else if($ASK.ON)
				$MRQ.flash(`<i>${Math.abs(minsOff)}</i> minutes since last update.`, true, -1);
			else if(minsOff < -9)
				$MRQ.flash(`Server data is unexpectedly old: <i>${Math.abs(minsOff)}</i> minutes behind.`);
			$ANI.updateFlash();
			$GUI.setTheme($DAT.MODE);
		}
		if($TOP.ON && !retry) {
			if($TOP.LOG) {
				if(!($TOP.LOG=$DAT.DATA['log']))
					$MRQ.flash('Live log support is currently not available, reverted to top mode.', true, 20000);
				else {
					$DAT.DATA.items = [];
					$TOP.WS.connect();
					return;
				}
			}
			if($HST.DATA.length==1 && json['search'])
				$HST.DATA.unshift({'top':true,'items':[],'marquee':[],'next':0,'highlight':0,'ts':0});
			else if(!$DAT.DATA['search']) {
				if($HST.DATA.length > 1 && !json['search'])
					$HST.DATA.pop();
				$HST.DATA[0] = $cloneObject($DAT.DATA);
			}
			$E('l_top_search').disabled = false;
			if(typeof json['search'] == 'string') {
				_E.value = json['search'];
				if(json['search'])
					$CFG.buttonToggle(true);
			}
			if(json['search'])
				$HST.updateStageData($HST.IDX=-2);
			if($TOP.searchCriteria()) $ANI.fastSplash();
			else if(!args || !args['fromPopState']) $NET.getHistoryData();
		}
		else {
			if($HST.DATA.length==1 && $W.history && $W.history.pushState) {
				[1,null,-1].forEach(state => $HST.push({'fixed':state}));
				$W.history.go(-1);
			}
			$POL.setNextStage(retry ? retry : $POL.getNextSync());
		}
	},
	getHistoryData: args => ($HST.FIRST=($HST.IDX>-1||--$HST.IDX<-1)) ? $NET.get(`/${$DAT.MODE}-history.json`, $NET.parseHistoryData, args) : null,
	parseHistoryData: (json, args) => {
		const dropDownMode=(args&&typeof args['dropDownIndex']!='undefined');
		if(!json || typeof json != 'object' || !Object.keys(json).length)
			return($MRQ.flash('Unexpected error pulling history.'));
		else if($TOP.ON) {
			$DAT.DATA['items'].forEach((row, i) => {
				if(!json['items'][row[0]]) return;
				$DAT.DATA['items'][i][$TSYM] = $HST.toSummaryString(json['items'][row[0]]);
				$DAT.DATA['items'][i].push(json['items'][row[0]]);
			});
			if(!$DAT.DATA['search']) {
				$DAT.DATA['search'] = '';
				$DAT.DATA['path'] = '/';
				$HST.DATA[0] = $cloneObject($DAT.DATA);
				$HST.pushWithPath($HST.DATA[0]);
			}
			if(dropDownMode)
				$HST.dropDown(args['dropDownIndex'])
			$GUI.contentTableUpdate();
			return;
		}
		let h = json.length;
		while(--h > 0) {
			if(json[h]['ts'] == $HST.DATA[0]['ts'])
				break;
		}
		if(h > 0) {
			json.length = h;
			$HST.DATA = json.concat($HST.DATA);
			if(dropDownMode)
				$HST.dropDown(args['dropDownIndex']);
			else {
				$HST.IDX = h - 1;
				$HST.updateStageData();
			}
		}
		else if(dropDownMode)
			$HST.dropDown(args['dropDownIndex']);
		else
			$MRQ.flash('Sorry, no additional history is available to rewind to at this time.');
	}
},

/*************************************************************************************************\
\*******  AUDIO & BROWSER API NOTIFY LOGIC  *********************************  [ $NFY.* ]  *******/
NFY: {
	NOTIFICATIONS: [], EXCEPTIONS: [], INTERVAL: null, ALLOWED: null,

	setup: disableFutureRequests => {
		if(disableFutureRequests)
			$removeFunction('NFY', 'setup');
		if(typeof _audioTest == 'string')
			_audioTest = new Audio(_audioTest);
		if(typeof _audioAlert == 'string') {
			_audioAlert = new Audio(_audioAlert);
			_audioAlert.load();
		}
		$NFY.requestPermission();
		$NFY.requestWakeLock();
	},
	notify: notifyRows => {
		$NFY.clear();
		if($HST.DATA.length < 2) return;
		if(!$isVisible() && typeof Notification != 'undefined' && Notification.permission == 'granted' && notifyRows.length) {
			$NFY.NOTIFICATIONS.push(new Notification('Larval - New domain bids!', {
				icon: $A('link') && Array.from(_A).find(l => l.rel==($isSafari()?'apple-touch-icon':'icon')).href,
				body: $U(notifyRows.map(r => r[$DOM] + ' $' + r[$PRC] + (r[$LTME]*1000>Date.now() ? ('@'+$minutesRemaining(r[$LTME])+'m') : ''))).join(' ')
			}));
		}
		else 
			$NFY.requestPermission();
		notifyRows.push([]);
		$NFY.INTERVAL = setInterval(() => {
			if(!$D.hidden || !$NFY.INTERVAL)
				$NFY.clear();
			else if(!notifyRows[0] || !notifyRows[0][0])
				$updateTitleWithPrefix();
			else
				$D.title = notifyRows[0][$DOM] + ' | $' + notifyRows[0][$PRC] + (notifyRows[0][$LTME]*1000>Date.now() ? (' | '+$minutesRemaining(notifyRows[0][$LTME])+'m') : '');
			notifyRows.push(notifyRows.shift());
		}, 1000);
		$NFY.playAudio(_audioAlert, true);
		$scrollToTop();
	},
	clear: () => {
		if($NFY.INTERVAL) {
			clearInterval($NFY.INTERVAL);
			$NFY.INTERVAL = null;
		}
		$updateTitleWithPrefix('');
	},
	exception: (symbol, disable) => {
		if(disable) {
			if($DAT.ON_TOP[symbol])
				$DAT.setSymbolsOnTop(symbol, true, false);
			else if($I($NFY.EXCEPTIONS, symbol) < 0)
				$NFY.EXCEPTIONS.push(symbol);
		}
		else if($I($NFY.EXCEPTIONS, symbol) >= 0)
			$NFY.EXCEPTIONS.splice(_I, 1);
		$CFG.set('l_exceptions', (new Date()).toLocaleDateString() + ' ' + $NFY.EXCEPTIONS.join(' '));
		$GUI.contentTableUpdate(false, true);
	},
	vibrate: pattern => {
		if(navigator.vibrate)
			navigator.vibrate(pattern ? pattern : _vibrateAlert);
	},
	playAudio: (audio, vibrateFallback, disableWarning) => {
		if(_settings['l_audible'] && typeof audio == 'object' && audio.play && !(audio.currentTime=0))
			audio.play()
			.then(() => $NFY.playAudioCallback(null, vibrateFallback, disableWarning))
			.catch(err => $NFY.playAudioCallback(err, vibrateFallback, disableWarning));
		else if(vibrateFallback)
			$NFY.vibrate();
	},
	playAudioCallback: (error, vibrateFallback, disableWarning) => {
		if(disableWarning)
			_warnings[$WAUD] = error = false;
		else if((error ^ _warnings[$WAUD]) || _warnings[$WAUD] === false)
			return;
		$updateTitleWithPrefix(error ? _char['warning'] : '');
		_warnings[$WAUD] = (error ? 'Audible notifications are enabled but your browser failed to play, interaction may be required: <span class="l_warning_audio">click here to attempt to resolve this automatically</span>.' : false);
		$MRQ.update(true, true);	
		if(error === false && disableWarning === true)
			$MRQ.flash('If you did not hear a sound you likely need to manually resolve this.');
		else if(vibrateFallback)
			$NFY.vibrate();
	},
	requestPermission: neverAskAgain => {
		if($NFY.ALLOWED || typeof Notification == 'undefined' || _settings['l_no_notifications'] || _warnings[$WNOT] === false)
			return;
		else if(neverAskAgain) {
			$CFG.set('l_no_notifications', true);
			_warnings[$WNOT] = false;
			$MRQ.flash('Updated settings to no longer mention your notification status.');
		}
		Promise.resolve(Notification.requestPermission()).then(status => {
			if(status == 'denied') {
				if(!_settings['l_no_notifications'])
					_warnings[$WNOT] = 'Browser notifications appear to be disabled, permissions may need to be manually added to resolve this: <span class="l_warning_never_notify">click here to disable this warning</span>.';
				$NFY.ALLOWED = false;
			}
			else if (status == 'granted')
				$NFY.ALLOWED = true;
		}).catch(() => $NFY.ALLOWED = null);
	},
	requestWakeLock: () => {
		if(!navigator.wakeLock || _wakeLock)
			return;
		navigator.wakeLock.request('screen').then(wakeLock => {
			_wakeLock = wakeLock;
			_wakeLock.addEventListener('release', () => {
				_wakeLock = null;
				$NFY.requestWakeLock();
			});
		}).catch(() => _wakeLock = null);
	}
},

/*************************************************************************************************\
\*******  DATA & MARQUEE POLLING LOGIC  *************************************  [ $POL.* ]  *******/
POL: {
	LONG: 300, SHORT: 30, NOW: 1, EPOCH_COMPLETE: 0,

	setup: () => void(0),
	forceNextStage: force => $ASK.ON ? null : $ANI.updateFlash(0.75),
	getNextSync: () => {
		if(!$DAT.DATA || !$DAT.DATA['next'])
			return($POL.LONG);
		let next = Math.floor($DAT.DATA['next'] - (new Date().getTime() / 1000)) + Math.floor(Math.random() * 10);
		if(next < 0 || next > $POL.LONG + $POL.SHORT)
			next = $POL.LONG;
		return(next);
	},
	setNextStage: (seconds, marqueeInitiate) => {
		if($ASK.ON)
			return;
		if($ANI.COMPLETE)
			$ANI.reset('l_progress_display', `l_progress ${seconds}s linear forwards`);
		if($DAT.TIMEOUT)
			clearTimeout($DAT.TIMEOUT);
		$DAT.TIMEOUT = setTimeout(() => $POL.setNextStageComplete(marqueeInitiate), seconds * 1000);
		$POL.EPOCH_COMPLETE = $epochNow() + seconds;
	},
	setNextStageComplete: marqueeInitiate => {
		if($DAT.TIMEOUT)
			clearTimeout($DAT.TIMEOUT);
		$DAT.TIMEOUT = null;
		if(marqueeInitiate)
			$MRQ.initiate();
		$NET.getStageData(true);
	},
	progressReset: force => {
		if($POL.EPOCH_COMPLETE || force)
			$POL.setNextStage($POL.EPOCH_COMPLETE - $epochNow()); 
	}
},

/*************************************************************************************************\
\*******  ASK MODE LOGIC (ask.larval.com)  **********************************  [ $ASK.* ]  *******/
ASK: {
	ON: false,
	setup: () => {
		if(!($ASK.ON=location.href.match(/ask/i)))
			return;
		$E('l_root').classList.add('l_ask_only');
		$MRQ.flash('Premium domain monitoring.', true, -1);
	}
},

/*************************************************************************************************\
\*******  TOP MODE LOGIC (top.larval.com & log.larval.com)  *****************  [ $TOP.* ]  *******/
TOP: {
	ON: false, LOG: false, INTERVAL: null, SOCKET: null,

	setup: () => {
		if(typeof WebSocket == 'undefined' || $TOP.INTERVAL || !($TOP.LOG=!!$D.domain.match(/log/i)))
			return;
		$MRQ.flash('Live log connection: <i>Initiating</i>', true, -1)
		$E('l_root').classList.add('l_top_log');
		$TOP.INTERVAL = setInterval($TOP.WS.connect, 30000);
	},
	timeFormat: str => str + (str.match(/[0-9]{2}\/[0-9]{2}$/)?'@[<u>TBD</u>]':''),
	searchCriteria: set => (typeof set=='string'?($E('l_top_search').value=set):$E('l_top_search').value) + (_E.value&&_E.dataset.append?_E.dataset.append:''),
	searchRunOnEnter: e => (!e||(e.keyCode!=13&&!(e.code&&e.code.match(/Enter$/)))) ? null : $TOP.searchRun(false),
	searchRun: value => {
		if($E('l_top_search').disabled) return;
		_E.dataset.append = (value===false?'!':'');
		if(typeof value=='string')
			_E.value = value;
		if(!_E.value && $HST.DATA.length && $HST.DATA[0]['items'].length>0) {
			$HST.IDX = 0;
			$HST.updateStageData(true);
		}
		else {
			_E.disabled = true;
			_E.blur();
			$POL.forceNextStage(true);
		}
	},
	searchFromURL: (str, run) => {
		let args=[];
		Object.entries(_topURLMap).find(kv => $M(kv[1],str) ? kv[0].split('').forEach((c,i) => args.push(c+_M[i+1])) : null);
		if($E('l_top_search') && args.length > 0)
			_E.value = args.join(' ');
		if(!run) return(_E.value);
		else if(!$TOP.ON)
			$DAT.toggleStage(str);
		else
			$TOP.searchRun();
	},
	WS: {
		connect: () => {
			if(!$TOP.LOG || ($TOP.SOCKET && $TOP.SOCKET.readyState !== WebSocket.CLOSED))
				return;
			$TOP.SOCKET = new WebSocket($TOP.LOG.replace(/#.*/,''));
			Object.keys($TOP.WS).forEach(n => `on${n}` in $TOP.SOCKET ? $TOP.SOCKET.addEventListener(n,$TOP.WS[n]) : null); 
		},
		message: e => {
			try {
				const row = JSON.parse(e.data);
				if(!$DAT.LAST || !row || !row.length || !$DAT.DATA.items.unshift(row) || !$ANI.COMPLETE)
					return;
				$E('l_content_table').insertRow(1).innerHTML = `<tr class="l_bids" data-ref="0">
					<td class="l_top_user" title="${$H(row[$TUSR])}"><i>${$GUI.cell(row,$TUSR)}</i></td>
					<td>${$GUI.cell(row,$TSYM)}</td>
					<td>${$GUI.cell(row,$TRAT)}</td>
					<td>${$GUI.cell(row,$TPCT)}</td>
					<td>${$GUI.cell(row,$TPCR)}</td>
					<td>${$GUI.cell(row,$TSTR)}</td>
					<td>${$GUI.cell(row,$TEND)}</td>
					</tr>`;
				if($DAT.DATA.items.length > 500)
					$DAT.DATA.items.length--;
				Array.from($E('l_content_table').getElementsByTagName('tr')).forEach((tr,i) => {
					if(i > $DAT.DATA.items.length) _E.deleteRow(i);
					else if(i) tr.dataset.ref = i-1;
				});
			}
			catch(e) { }
		},
		open: e => {
			if($DAT.DATA)
				$DAT.DATA.items = [];
			$GUI.contentTableUpdate();
			$MRQ.flash('Live log connection: <i>Active</i>', true, -1)
		},
		close: e => $MRQ.flash('Live log connection: <span class="l_marquee_highlight"><i>INACTIVE</i></span>', true, -1)
	}
},

/*************************************************************************************************\
\*******  MISCELLANEOUS HELPERS  ************************************************  [ $* ]  *******/
multiplierFormat: (number, digits, approx) => {
	if(typeof number != 'number')
		return(number);
	for(let prefix in _multipliers) {
		if(number >= _multipliers[prefix])
			return((number/_multipliers[prefix]).toFixed(digits) + prefix);
	}
	return(approx ? '~'+(Math.ceil(number/100)*100).toString() : number.toString());
},
timeRemaining: (epoch, updatable) => {
	let mins=$minutesRemaining(epoch), absMins=Math.abs(mins);
	return((updatable?`<span class="l_update${mins<0?' l_past':''}" data-tr-update="${epoch}">`:'')+(absMins>=60?Math.floor(absMins/60)+'hr&nbsp;':'')+(absMins%60)+'min&nbsp;'+(mins<0?'ago':'left')+(updatable?'</span>':''));
},
minutesRemaining: epoch => Math.floor((epoch-(Date.now()/1000))/60),
dateFormat: (epoch, strict) => epoch ? (new Date(epoch*1000).toLocaleString('en-US', (strict||$minutesRemaining(epoch)>=60) ? {month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:true} : {hour:'2-digit',minute:'2-digit',hour12:true}).replace(/\s+/g,'').replace(/,/,'&nbsp;@&nbsp;')) : $F('f_empty_cell'),
multiplierExplicit: (value, multiplier, precision) => _multipliers[multiplier] ? ((value/_multipliers[multiplier]).toFixed(precision) + multiplier) : value,
htmlPercent: (number, precision) => number ? ($N(Math.abs(number), precision) + $F(number>0?'f_l_up':'f_l_down')) : $F('f_empty_cell'),
scrollToTop: smooth => ($W.scrollY ? $W.scrollTo({top: 0, behavior: smooth?'smooth':'auto'}) : false) !== false,
keyModeReset: () => $GUI.KEY_ROW ? $EVT.keydown(false) : null,
epochNow: () => Math.floor(Date.now() / 1000),
epochToDate: epoch => new Date(epoch * 1000).toLocaleTimeString('en-US', {weekday:'short',hour:'numeric',minute:'2-digit',timeZoneName:'short'}),
createURL: (symbol, type) => _keyMap[_keyMap[$GUI.KEY_MAP_IDX]?$GUI.KEY_MAP_IDX:$GUI.KEY_MAP_IDX_DEFAULT][type].replace('@',symbol),
cloneObject: obj => typeof structuredClone=='function' ? structuredClone(obj) : JSON.parse(JSON.stringify(obj)),
updateTitleWithPrefix: setPrefix => $D.title = (typeof setPrefix=='string' && !$TOP.ON ? (_titlePrefix=setPrefix) : _titlePrefix) + _title,
removeFunction: (comp, func) => $W['$'+comp][func] = $L[comp][func] = () => void(0),
hasSettings: () => localStorage && localStorage.getItem('larval'),
isSafari: () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
isMobile: strict => 'ontouchstart' in $D.documentElement && (!strict || /iphone|android/i.test(navigator.userAgent)),
isVisible: el => (el ? $W.getComputedStyle(el).visibility : $D.visibilityState) == 'visible',
isShowing: type => typeof _settings[type] == 'object' && _settings[type]['l_show'],
isWeekend: dateObj => $I([0,6], (dateObj?dateObj:new Date()).getDay()) >= 0,
isHaltRow: row => row && row[$HLT] && typeof row[$HLT] == 'string'
} /* EOF */
