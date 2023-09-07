/*|___ ___ _ _ ___| |  A strange, hacky, and experimental barebones project that tracks various markets.
| | .'|  _| | | .'| |  (: An excuse to escape into the nostalgia of slapping something together agian :)
|_|__,|_|  \_/|__,|*/

const $L = { _components: ['EVT', 'CFG', 'GUI', 'HST', 'DAT', 'NFY', 'NET', 'ANI', 'MRQ', 'POL', 'TOP'],
_title:	'',
_titlePrefix: '',
_wakeLock: null,
_fragments: {},
_warnings: [],
_extURLOptions: 'noreferrer noopener',
_topURLMap: { '@#':/^[#/]*?([A-Z0-9_]+)\/message\/([0-9]+)/i, '@':/^[#/]*?([A-Z0-9_]{5,32}|((?=.*?\d)(?=.*?[A-Z])[A-Z\d]+))\/?$/i, '$':/^[#/]*?symbol\/([A-Z]{1,4})\/?$/ },
_multipliers: { 'B':1000000000, 'M':1000000, 'K':1000 },
_symbolsStatic: ['^VIX', '^DJI', '^GSPC', '^IXIC', '^RUT', '^TNX', '^TYX'],
_assetTypes: ['l_stocks', 'l_etfs', 'l_crypto', 'l_futures', 'l_currency'],
_char: { 'up':"\u25b2 ", 'down':"\u25bc ", 'updown':"\u21c5 ", 'warning':"\u26a0 ", 'halt':"\u25a0 ", 'etf':"~", 'crypto':"*", 'futures':'^', 'currency':"$", 'user':"@" },
_themes: {
	'default':    ['#A6FDA4','#E1FDE4','#88CF86','#7DFF7A','#A6FDA4','#FF4444','#2A302A','#303630','#363C36','#825900','#FFDE96','#FAEED4','#A6FDA4','#00AA00','#85FF92','#FF0000','#FDA4A4','#8FDE8C','#FAF4E6'],
	'afterhours': ['#95ABFC','#CDDFFF','#8BA4FF','#7492FF','#D274FF','#FF4444','#2A2A30','#303034','#36363C','#660303','#FF73BB','#D4DCFA','#A0FACA','#00AAAA','#85FFD6','#FF0080','#FDA4CF','#A6B7F7','#E6EAFA'],
	'bloodbath':  ['#FC656F','#FAB6B6','#F77272','#FF4747','#FFAE74','#FFCC54','#361010','#4B1818','#602121','#825900','#FFEC73','#F2D088','#D4F0A3','#91AD03','#FAB143','#FF0000','#FF7070','#FC868E','#FAF4E6'],
	'top':        ['#A6FFFF','#E1FDFF','#88CFD1','#A6FFFF','#75bcff','#9175ff','#2A3030','#303636','#363C3C','#825900','#FFDE96','#FCF0D2','#A6FFFF','#00AA00','#85FF92','#FF0000','#FDA4A4','#8FDEDE','#FAF4E6']
}, _theme: '', _themeBGColorIndex: 7,
_keyMap: {
	'A': ['https://www.seekingalpha.com/symbol/@', 'https://www.seekingalpha.com/symbol/@-USD'],
	'B': ['https://www.barchart.com/stocks/quotes/@', 'https://www.barchart.com/crypto/coins/@'],
	'C': ['https://www.cnbc.com/quotes/@', 'https://www.cnbc.com/quotes/@.CM='],
	'D': ['https://research.tdameritrade.com/grid/public/research/stocks/summary?symbol=@'],
	'E': ['https://www.etrade.wallst.com/v1/stocks/snapshot/snapshot.asp?symbol=@'],
	'F': ['https://www.finviz.com/quote.ashx?t=@', 'https://www.finviz.com/crypto_charts.ashx?t=@USD'],
	'G': ['https://www.benzinga.com/quote/@/short-interest', 'https://www.benzinga.com/quote/@-USD'],
	'H': ['https://www.stockcharts.com/h-sc/ui?s=@'],
	'I': ['https://www.investing.com/search/?q=@'],
	'J': ['https://www.wsj.com/market-data/quotes/@'],
	'K': ['https://www.morningstar.com/stocks/xnas/@/quote'],
	'L': ['https://www.fool.com/quote/@', 'https://www.fool.com/quote/crypto/@'],
	'M': ['https://www.marketwatch.com/investing/stock/@', 'https://www.marketwatch.com/investing/cryptocurrency/@USD'],
	'N': ['https://money.cnn.com/quote/quote.html?symb=@'],
	'O': ['https://www.cboe.com/delayed_quotes/@'],
	'P': ['https://eresearch.fidelity.com/eresearch/goto/evaluate/snapshot.jhtml?symbols=@'],
	'Q': ['https://www.nasdaq.com/market-activity/stocks/@'],
	'R': ['https://www.robinhood.com/stocks/@', 'https://www.robinhood.com/crypto/@'],
	'S': ['https://www.stocktwits.com/symbol/@', 'https://www.stocktwits.com/symbol/@.X'],
	'T': ['https://www.tradestation.com/research/stocks/@'],
	'U': ['https://www.gurufocus.com/stock/@'],
	'V': ['https://www.tradingview.com/chart/?symbol=@', 'https://www.tradingview.com/chart/?symbol=@USD'],
	'W': ['https://www.twitter.com/search?q=%24@','https://www.twitter.com/search?q=%24@.X'],
	'X': ['https://www.foxbusiness.com/quote?stockTicker=@'],
	'Y': ['https://finance.yahoo.com/quote/@', 'https://finance.yahoo.com/quote/@-USD', 'https://finance.yahoo.com/quote/@=F', 'https://finance.yahoo.com/quote/@=X', 'https://stocktwits.com/@'],
	'Z': ['https://www.zacks.com/stock/quote/@'],
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
	}, '#l_audible, #l_options_only, #l_notify_halts, #l_show': {
			change:e    => $CFG.change(e)
	}, '#l_range_up, #l_range_down, #l_range_volume': {
			input:e     => $CFG.updateRange(e),
			change:e    => $CFG.change(e)
	}, '#l_content_table': {
			mousemove:e => $keyModeReset()
	}, 'animate': {
			endEvent:e  => e && e.target && e.target.setAttribute('begin', '')
	}
},
_clickMap: {
	'l_alt_link':_              => $TOP.LOG ? (location.href='//larval.com') : $DAT.toggleStage($TOP.ON),
	'l_content_table_header':_  => $DAT.setStageSort(_.idx),
	'l_fixed':_                 => $GUI.broadBehaviorToggle($TOP.ON),
	'l_history_toggle':_        => $HST.dropDownToggle(_.idx),
	'l_hotkey_help':_           => $MRQ.hotKeyHelp(),
	'l_last_update':_           => $POL.forceNextStage(),
	'l_marquee_flash':_         => $HST.gotoStageData(0),
	'l_marquee_info':_          => $DAT.setURLFormat(_.sym, false),
	'l_marquee_talk':_          => $TOP.searchFromURL(_.raw, true),
	'l_news':_                  => typeof $DAT.DATA['items'][_.idx][$LNK]=='number' ? $GUI.relatedToggle(_.idx) : $W.open($DAT.DATA['items'][_.idx][$LNK], `l_news_${_.sym}`, _extURLOptions),
	'l_notify_disable':_        => $NFY.exception(_.raw, true),
	'l_notify_enable':_         => $NFY.exception(_.raw, false),
	'l_range_volume_type':_     => $GUI.vpmToggle(),
	'l_related':_               => $GUI.relatedToggle(_.idx),
	'l_settings_button':_       => $CFG.buttonToggle(null, true),
	'l_ta':_                    => $W.open(_keyMap[_.el.dataset.keymap?_.el.dataset.keymap:$GUI.KEY_MAP_IDX_DEFAULT][$KSTK].replace('@', _.sym), `l_ta_${_.sym}`, _extURLOptions),
	'l_tab':_                   => $CFG.tabSelect(_.el),
	'l_warning_audio':_         => $NFY.playAudio(_audioTest, false, true),
	'l_warning_never_notify':_  => $NFY.requestPermission(true),
	'shift_default':_           => _.raw ? $TOP.searchFromURL('/symbol/'+($M(/[A-Z0-9_]+$/ig,_.raw)?_M[0]:_.raw), true) : $DAT.editSymbolsOnTop(),
	'alt_default':_             => _.raw ? $DAT.setSymbolsOnTop(_.raw, null, true) : $DAT.editSymbolsOnTop(),
	'default':_                 => $W.open($createURL(_.sym, _.type), `l_${_.type}_${_.sym}`, _extURLOptions)
},
_hotKeyMap: {
	'ArrowDown':e               => $GUI.KEY_ROW++,
	'ArrowUp':e                 => $GUI.KEY_ROW--,
	'ArrowLeft':e               => $HST.gotoStageData(1),
	'ArrowRight':e              => $HST.gotoStageData(-1),
	'Backquote':e               => $DAT.editSymbolsOnTop(),
	'Backslash':(e,ev)          => $ANI.toggle(null, ev.shiftKey),
	'Backspace':e               => $GUI.vpmToggle(),
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
	'Tab':e                     => $DAT.toggleStage(e)
}, _hotKeyMapIgnore: ['ShiftLeft','ShiftRight'],
_enumMap: {
	'stage': {
		'SYM':_   => $H(_.val),
		'NAM':_   => $H(_.val),
		'PCT5':_  => $isHaltRow(_.row) ? $H(_.val?_.val:'HALTED') : $htmlPercent(_.val,2),
		'PCT':_   => $htmlPercent(_.val,2),
		'PRC':_   => '$' + $N(_.val,_.row[$OPT]=='currency'&&_.val<10?4:2),
		'VOL':_   => $multiplierFormat(_.val,1,true),
		'OPT':_   => $H(_.val),
		'OIV':_   => _.row[$SYM][0]==_char['crypto'] ? ('MC#'+_.val) : ($H(_.val>0?_.val:('~'+Math.abs(_.val))))+'%IV',
		'ERN':_   => $H(_.val),
		'PRC5':_  => (_.val<0?'-$':'+$') + $N(Math.abs(_.val),_.row[$OPT]=='currency'?4:2),
		'VOL5':_  => '+' + $multiplierFormat(_.val,1),
		'PCTM':_  => 'M=' + $htmlPercent(_.val,0),
		'PCTY':_  => 'Y=' + $htmlPercent(_.val,0),
		'NWS':_   => $H(_.val),
		'LNK':_   => _.val,
		'KSTK':0, 'KETF':0, 'KCRP':1, 'KFTR':2, 'KCUR':3, 'KUSR':4,
		'WAUD':0, 'WNOT':1, 'HLT':2, 'AGE': 6, 'TAN':8, 'REL':8
	},
	'top': {
		'TUSR':_   => $H(_.val),
		'TSYM':_   => _.val,
		'TRAT':_   => isNaN(_.val) ? `<i data-msg-idx="${_.idx}" class="${_.val[0]=='+'?'l_top_up':'l_top_down'}">${_.val.substr(1)}</i>` : (_.val+'%'),
		'TPCT':_   => $htmlPercent(_.val,2),
		'TPCR':_   => $htmlPercent(_.val,2),
		'TSTR':_   => $H(_.val),
		'TEND':_   => $TOP.timeFormat(_.val),
		'TTWT':_   => $H(_.val),
		'THST':_   => void(0),
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
	'l_stocks':           { 'l_show':true,  'l_range_up':50,  'l_range_down':50,  'l_range_volume':25,   'multiplier':'K', 'percent_shift':10,  'volume_shift':1,   'vpm_shift':10,   'vpm_precision':1 },
	'l_stocks_ah':        { 'l_show':true,  'l_range_up':100, 'l_range_down':100, 'l_range_volume':null, 'multiplier':'K', 'percent_shift':10,  'volume_shift':1,   'vpm_shift':1,    'vpm_precision':0 },
	'l_etfs':             { 'l_show':true,  'l_range_up':100, 'l_range_down':100, 'l_range_volume':50,   'multiplier':'M', 'percent_shift':100, 'volume_shift':100, 'vpm_shift':1000, 'vpm_precision':0 },
	'l_crypto':           { 'l_show':false, 'l_range_up':50,  'l_range_down':50,  'l_range_volume':25,   'multiplier':'M', 'percent_shift':10,  'volume_shift':1,   'vpm_shift':1000, 'vpm_precision':0 },
	'l_futures':          { 'l_show':false, 'l_range_up':50,  'l_range_down':50,  'l_range_volume':null, 'multiplier':'K', 'percent_shift':100, 'volume_shift':1,   'vpm_shift':1,    'vpm_precision':0 },
	'l_currency':         { 'l_show':false, 'l_range_up':25,  'l_range_down':25,  'l_range_volume':null, 'multiplier':'K', 'percent_shift':100, 'volume_shift':1,   'vpm_shift':1,    'vpm_precision':0 }
}, _settingsBase: {}, _settingsSelectedTab: {}, _settingsSelectedTabName: '',
_vibrateAlert: [250,250,500,250,750,250,1000], _audioAlert: '/larval.mp3', _audioTest: 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAgAAAQdgAyMjI8PDxCQkJKSkpTU1NbW1tiYmJoaGhubm5udXV1e3t7gYGBh4eHjo6OlJSUmpqaoaGhoaenp62trbS0tLq6usDAwMfHx83NzdPT09Pa2trg4ODm5ubt7e3z8/P5+fn///8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAXAAAAAAAAAEHarUeu2AAAAAAAAAAAAAAAAAAAAAP/7sGQAAACLAFMVAAAAAAAP8KAAAQt4x1W5CAAAAAA/wwAAAApAD////ggGMHAxwQOf1g+D93AAlAAAktziZCAAAABCKFUwLn/Wpbf/9nXQPGJoTw5I9mo558opDkjQYthiUBvJhA3IgO08sghGkPJ8e0DFMrE8T4txeMi4VWQKCBoThJoPmSJAioaJmpGDmE8qcGAAAACLESGAAXgmdX/////Jr1RCODjmT0O3SrW4S0S8ekMLOMIK51hDcelefsWjsM9hjzYAAWAXoyggACwi9Jf/QWo/I/XFhoUSEtWn8eRsu1jSdv708NaE1dahOBlOebAAoAC9GCEAALkyqRS/20Km4AGQV63ICdySNmrpT/nvDvH+gy9vv+sF2FZgBaSSwABuwHSUGUSGWt30AznhGXJWceHwaWC7FIFKaC4v1wkSFw26F8sACaqXkEKAAk+XGSzC4mkEpddOLHuMKpCwu/nQkaCCiDw4UJihgsIkCCpIu89DDDuwAsAzf4UiAAX0ChfTMov7f+3najILDqu/k+47//ff6fTrx0/6amsLggbHBQi9u7ALv1oAAAOBlDCNEXI0S5IaIxXf/MS5+wg41upO6pfCRob+7n337v839+d2J41gGKBp2gAMy+2ALyS1xpa/UtcaK92z2XSIoN2NZoKAL9WtnfaSj/K+T5GmLeB8+dXx/+IQxpwcqgvsAAzNz7QpgAFbI0yJkyXP/4XQpct1WpPlLKuQsHDoN6DJ3XUo8WExodqvOBUIVugAaAd7q3AAE7YBpOA6Tj17wx7iLniQ7z4YBkMhIStYHXvsszjXEDZIIvDpw84Iu7AAsA1b//swZPAA8ZswVn9IYAIAAA/w4AABBZSXZegAbkAAAD/AAAAERAAAC0FJ8BkmZaAXpT/a06wtirRCx84x7x6FtfQ2o1KsIuQDyNIAAROMHpaAkmZf//BIsJCwsRekKvGsFZZUc2x+IksSJjFzCAAAiAAB7dAAAqnNUv/a2qotk/beuXRmopbUlQya/ZDawz1WNgAOAB/QPi4KCTvO//sQZPwE8VIS2XogEyIAYBpgBAABBRARZ+YxIAABgGtAEAAEf+RrFz1CUIkXTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRwAPwABwAAAC+RFCfAIT//+bUxGAAK7BRb/+yBk9ADxgwRZey8wEABgGyAEAAEFkEtv6LBAaAKAa0AQAARJTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVCQAAkAAAAAALpO9Q1hf6hdpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqq//swZPQB8Y4TWnnhEeoBwCpQLAABBmhDZ+yBaKgFgGhBAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqHwAAAAZtxAcbGoAFAAUjwJv+t0xBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTAPAAARKoF9LhRhDgABAAARRQMf6A41TEFNRTMuMTAw//sgZPuA8XAYXHogGagAoBrQBAABBdgRb+exgCABgGzAEAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVCYAEAA/qsR8QIQAAUACRZnfhoMpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7EGT7hPE7BFn5LEgIAGAbUAQAAQTcD2HnsSAgAYBtABAABKqqqqqqqqqqqqqqqqqqqqqqqqqqFAAAAARYQ4ADn9AJqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQZPYB8RwvV/ogE7oAYBsQBAABApQHV6wIACABgGrAEAAEqqqqqqqqqqqqqqqqqqqqqhAAKAAEXt9SFoAFAAckg/8vTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk6ofwkwLV6iIACABgGhAEAAEA1AtWhpggMAGAaEAQAARVVVVVVVVVVVVVVVVVVVVVVQADAAAPOf0hYkAatG/QJ0tMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTmD/BkANfxYAAIAGAaUAQAAQBsA14FgAAgAYBrABAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVUGR2QA4Aos340OtUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZOcD8EUC1aICCAgAYBsABAABATAFUogAACABgGtAEAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUQCAAACF5/JsbiTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xBk6QPwUAFVQeAADABgGsAEAAEBeAlbxQgAIAGAasAQAASqqqqqqqqqqqqqqqqqqqqqqqqAAAC0uxinpVhAAoJ+kO1MQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTng/BJAVKh4AAIAGAaYAQAAQEgB06FhAAgA4BnwGAABFVVVVVVVVVVVVVVVVVVVVVVVYAAAFgX0vDlAXTAQY8MqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQZOQL8DAA1KFgAAoAYBqABAABALgFVIUAACABgGlAEAAEqqqqqqqqqqqqqqqqqqqqqqpACAAAC5NnhjABgBNqPuJVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk5gPwPQDUIWAACABgGhAEAAEBHAVQhQAAIAAAP8AAAARVVVVVVVVVVVVVVVVVVVVVVcIAAIEAV3nSsAAgAIY99ZlMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTli/BEAVFB4AAIAAAP8AAAAQDkBUEHgAAgAYBowBAABFVVVVVVVVVVVVVVVVVVVVVVgAEAAAlyn4egATQ4S7aWqUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZOMD8BABUIGgAAgAYBpABAABAPgFRwaAACABgGkAEAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYAAAVsNkGGQ/rHqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xBk4o/wPwHQwYEACABgGiAEAAEALAU+AwAAIAAAP8AAAASqqqqqqqqqqqqqqqqqqqqqqkAAADcSGXI7kwACABuH/lpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7EGTlA/BDAc8p4QAMAAAP8AAAAQDIBT6hgAAgAAA/wAAABKqqqqqqqqqqqqqqqqqDAAFNZ3wVNyAFe2sb97f///6ZekxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQZOUH8D0BTqjAAAgAAA/wAAABANAFPqWAACAAAD/AAAAEqqqqQAIAABl/Ej////9Bb+5VCgFABwd5tpz////IL/5aTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xBk5YPwQgDQQWAACAAAD/AAAAEA5AVDBIAAIAAAP8AAAASqqqqq4AgAIAOK+f////5Qw7/ILwAPWJf3f///5Mg//RVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVYQAE2AAQABI4//7EGTlg/BDAU+oQAAIAAAP8AAAAQD0Bz8BAAAgAAA/wAAABD4cEhkt///+ZDwNf1y3ADAAF7xD0JDX///+LGyX1RHEikxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQZOWD8EIBT8DAAAgAAA/wAAABAPADPKeAADAAAD/AAAAEqqqEAAMABAU0Fvzzv///9RD9bHrjYACdhtvx//////+qTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xBk4w/wLAFQKeAADgAAD/AAAAEAnAU8BAAAIAAAP8AAAASqoAABayj2f////86iCAAAAAAAE/VPTwwCtpm8j////+xMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7EGTlg/BHAc8oQgAIAAAP8AAAAQDcBUEFgAAgAAA/wAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQZOeH8D8BUKngAAwAAA/wAAABAXQHQQeEAAAAAD/AAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xBk7IPwewDQQWAAAAAAD/AAAAEBzAFDAAAAAAAAP8AAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7EGTsBfB+AVFAYAAAAAAP8AAAAQGUBUCkgAAAAAA/wAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQZPKB8LUBUWFgAAAAAA/wAAABAlgFQwYAAAAAAD/AAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xBk7QfwkgHRWeAAAAAAD/AAAAEBkAVIhYAAAAAAP8AAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7EGTtgABZAVAtPAAAAAAP8KAAAQKcCUKY8AAAAAA/wwAAAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQZN2P8AAAf4cAAAgAAA/w4AABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=',

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
		if(typeof dataRef == 'string')
			sym = dataRef;
		else if(typeof dataRef == 'number') {
			idx = dataRef;
			sym = $DAT.DATA['items'][idx] ? $DAT.DATA['items'][idx][$SYM] : idx;
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
			$MRQ.flash('Slow graphics detected, disabling most animations.  Use the <i>backslash</i> key to re-enable.');
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
		$GUI.setStage(($TOP.searchFromURL(location.hash?location.hash:location.pathname) || $D.domain.match(/top|log/i)) ? 'top' : 'stage');
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
		if(!$hasSettings() && $isWeekend(now)) {
			$CFG.set('l_show', false, true, 'l_stocks_ah');
			$CFG.set('l_show', false, true, 'l_etfs');
			$CFG.set('l_show', true, true, 'l_crypto');
			$CFG.tabUpdateUI();
		}
		for(let key of Object.keys(_settings)) {
			if($E(key) && _E.type == 'checkbox')
				_E.checked = _settings[key];
		}
		for(let key of Object.keys(_settingsSelectedTab)) {
			if(!$E(key) || !_E['type'])
				continue;
			else if(_E.type == 'checkbox')
				_E.checked = _settingsSelectedTab[key];
			else if(_E.type == 'range')
				_E.value = (typeof _settingsSelectedTab[key]=='number' ? _settingsSelectedTab[key] : 0);
		}
		for(let id of ['l_range_up','l_range_down','l_range_volume'])
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
		if(id == 'l_range_volume') {
			if(!(input.disabled=typeof _settingsSelectedTab['l_range_volume']!='number'))
				display.innerHTML = (_settings['l_vpm'] ? $multiplierExplicit(input.value*_multipliers[_settingsSelectedTab['multiplier']] / _settingsSelectedTab['vpm_shift'],'K',_settingsSelectedTab['vpm_precision']) : ((input.value / _settingsSelectedTab['volume_shift']).toFixed(Math.ceil(Math.log10(_settingsSelectedTab['volume_shift']))) + _settingsSelectedTab['multiplier']));
			else
				display.innerHTML = 'N/A';
		}
		else
			display.innerHTML = (input.value / _settingsSelectedTab['percent_shift'] * (id=='l_range_down'?-1:1)).toFixed(Math.ceil(Math.log10(_settingsSelectedTab['percent_shift'])))
		if(_settings['l_vpm'] !== null)
			$E('l_range_volume_type').innerHTML = (_settings['l_vpm'] ? 'vpm' : 'vol');
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
	MODE: 'stage', DATA: null, SORT: 0, LAST: 0, ON_TOP: {}, FETCHING: null, TIMEOUT: null,

	setup: () => void(0),
	setStage: stageData => {
		if(!$DAT.DATA)
			$E('l_fixed').style.filter = 'grayscale(0%)';
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
				let column = Math.abs($DAT.SORT) - 1;
				if($TOP.ON && column==$TSYM)
					column = $THST;
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
			const minutes = (stageData['items'][i][$SYM][0]==_char['crypto'] ? minutesInADay : minutesSinceOpen);
			[$VOL,$VOL5].forEach(column => {
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
	toggleStage: e => {
		const explicit=(typeof(e)=='boolean'), topUrl=(e&&typeof(e)=='string'?e:'');
		if(!explicit && !topUrl && (!e||!e.code||e.code!='Tab'||$DAT.FETCHING))
			return(!$ANI.COMPLETE || !$DAT.DATA);
		if(e.preventDefault)
			e.preventDefault();
		if(topUrl)
			$HST.push({'toggle':false, 'path':'/'});
		[$MRQ.INTERVAL, $NFY.INTERVAL].forEach(i => i&&clearInterval(i));
		[$MRQ.TIMEOUT, $DAT.TIMEOUT].forEach(t => t&&clearTimeout(t));
		[$HST.DATA, $HST.SWAP] = [$HST.SWAP, $HST.DATA];
		$CFG.buttonToggle(false);
		$GUI.setStage($TOP.ON ? 'stage' : 'top');
		$CFG.buttonTextToggle(false);
		$CFG.tabSelect();
		if($HST.DATA.length > 0)
			$DAT.setStage($HST.DATA[0]);
		else
			$HST.FIRST = false;
		if(!$TOP.ON || !$HST.DATA.length)
			$NET.getStageData(true);
		else if($TOP.ON && topUrl)
			$TOP.searchFromURL(topUrl, true);
		else if(explicit === false)
			$TOP.searchRun('');
		else
			$GUI.contentTableUpdate();
		$HST.gotoStageData($HST.IDX=0);
		$MRQ.flash(`Toggling site mode to: <i>${$TOP.ON?'Top market players':'Volatility'}</i>`);
		$scrollToTop();
		if(!explicit)
			$HST.push({'toggle':$TOP.ON, 'path':topUrl?topUrl:'/'});
		return(true);
	},
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
	MAPS: {'top':[],'stage':[]}, MAP: null,
	KEY_MAP_IDX_DEFAULT: 'Y', KEY_MAP_IDX: null, KEY_ROW: 0,
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
	},
	setStage: set => {
		$TOP.ON = (set=='top');
		$GUI.MAP = $GUI.MAPS[$DAT.MODE=set];
		_title = document.title = ($TOP.ON?'Larval - Top market players':'Larval - Live market volatility dashboard');
		['l_stage_only','l_top_only'].forEach((cn,i) => $E('l_root').classList[i^$TOP.ON?'remove':'add'](cn));
	},
	forceRedraw: el => el && (el.style.transform='translateZ(0)') && void el.offsetHeight,
	setTheme: name => (_theme!=name && _themes[name] && _themes[_theme=name].forEach((color,i) => $D.body.style.setProperty(`--l-color-${i}`,color))),
	getThemeMode: prefix => $DAT.DATA ? ((prefix?prefix:'') + (['afterhours','bloodbath','top'].find(key => $DAT.DATA[key]) || 'default')) : null,
	setThemeRandom: message => {
		_theme = '', _themes['random'] = _themes['default'].map(() => '#'+(2**32+Math.floor(Math.random()*2**32)).toString(16).substr(-6));
		$GUI.setTheme('random');
		$MRQ.flash(message, false, 20000);
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
		let mainRow=$DAT.DATA.items[idx], symbols=[mainRow[$SYM]].concat(mainRow[$REL]), indices=($DAT.DATA.related&&$DAT.DATA.related[0]==idx?null:[idx]);
		if(indices) {
			$DAT.DATA.items.forEach((row, idx) => {
				if($I(symbols, row[$SYM]) > 0)
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
		$CFG.updateRange('l_range_volume');
		$GUI.contentTableUpdate();
	},
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
	contentTableRowPopout: row => {
		if(row[$REL] && typeof row[$REL] == 'object')
			$F('f_class_title_display', ['l_notify_popout l_related', 'Related movers', '&#128279;&nbsp;<i>related </i>movers']);
		else if(row[$TAN] && typeof row[$TAN] == 'string' && _taMap[row[$TAN]])
			$F('f_class_title_keymap_display', ['l_notify_popout l_ta', _taMap[row[$TAN]][0], (_taMap[row[$TAN]][2]?_taMap[row[$TAN]][2]:$GUI.KEY_MAP_IDX_DEFAULT), _taMap[row[$TAN]][1]]);
		else if(row[$ERN] && row[$NWS] && typeof row[$ERN] != 'object' && typeof row[$NWS] != 'object')
			$F('f_class_title_display', ['l_notify_popout l_news', `News and earnings on ${$GUI.cell(row,$ERN)}`, `&#128197;&nbsp;${$GUI.cell(row,$ERN)}<i>&nbsp;+&nbsp;news</i>`]);
		else if(row[$ERN] && typeof row[$ERN] != 'object')
			$F('f_class_title_display', ['l_notify_popout', `Earnings on ${$GUI.cell(row,$ERN)}`, `&#128198;&nbsp;${$GUI.cell(row,$ERN)}<i>&nbsp;earnings</i>`]);
		else if(row[$NWS] && typeof row[$NWS] != 'object')
			$F('f_class_title_display', ['l_notify_popout l_news', 'Company news', '&#128197;&nbsp;<i>recent </i>news']);
		else
			$F('');
		return(_F);
	},
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
		let i=-1, r=-1, rowRules={}, notifyRows=[], indices=[], notify=false, notifyRelated=false, visibleRows=0, onTop={}, htmlRow='', htmlPriority='', htmlNormal='', html='<tr>', stockAssetType=($DAT.DATA['afterhours']?'l_stocks_ah':'l_stocks');
		const columns = ($TOP.ON ? ['user',$TOP.LOG?'post':'symbols','bull','user%','real%','start',$TOP.LOG?'added':'end'] : ['symbol','company','~5min<i>ute</i>%','total%','price',$DAT.DATA['vpm']?'vpm':'volume','options']);
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
				'up': thisType['l_range_up'] / thisType['percent_shift'],
				'down': -thisType['l_range_down'] / thisType['percent_shift'],
				'volume': (thisType['l_range_volume']?thisType['l_range_volume']:0) * _multipliers[thisType['multiplier']] / thisType[$DAT.DATA['vpm']?'vpm_shift':'volume_shift']
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
			const row=$DAT.DATA['items'][i], rowType=_assetTypes[$I(_assetTypes,`l_${row[$OPT]}`)>=0?_I:(row[$SYM][0]==_char['etf']?1:0)], isStock=(_I<0), notifyExcept=($I($NFY.EXCEPTIONS,row[$SYM])>=0), isOnTop=!!$DAT.ON_TOP[row[$SYM]];
			let rowClass=rowType, notifyControl='', historyClass=($TOP.LOG?'':'l_history_toggle');
			if($TOP.ON) {
				if(isOnTop) {
					notifyControl = $F('f_class_title_display', ['l_notify_disable', `Remove ${$GUI.cell(row,$SYM)} from top`, 'x']);
					rowClass = ' l_top_highlight';
				}
				htmlRow = `<tr class="${rowClass}" data-ref="${i}">
					<td class="l_top_user">${notifyControl}<i>${$GUI.cell(row,$TUSR)}</i></td>
					<td class="${historyClass}${row[$TTWT]?' l_twit':''}">${$GUI.cellRollover(row,$TSYM,$TTWT)}</td>
					<td class="${historyClass}">${$GUI.cellTopRollover(row,$TRAT,$HMOD)}</td>
					<td class="${historyClass}">${$GUI.cellTopRollover(row,$TPCT,$HPCT)}</td>
					<td class="${historyClass}">${$GUI.cellTopRollover(row,$TPCR,$HPCR)}</td>
					<td class="${historyClass}">${$GUI.cellTopRollover(row,$TSTR,$HSTR)}</td>
					<td class="${historyClass}">${$GUI.cellTopRollover(row,$TEND,$HEND)}</td>
					</tr>`;
			}
			else if($isHaltRow(row)) {
				if(notifyExcept || !$isShowing(rowType))
					continue;
				notify = _settings['l_notify_halts'] && (!_settings['l_options_only']||row[$OPT]);
				rowClass = (notify ? 'l_notify_halt' : 'l_halt');
				htmlRow = `<tr class="${rowClass}" data-ref="${i}">
					<td>
					 ${$F('f_class_title_display', ['l_notify_disable', `Disable ${$GUI.cell(row,$SYM)} notifications for today`, 'x'])}
					 ${$GUI.cell(row,$SYM)}
					</td>
					<td class="${row[$NWS]?'l_news':''}">${$GUI.cellRollover(row,$NAM,$NWS)}</td>
					<td colspan="4">${$GUI.cell(row,$HLT)}</td>
					<td>${$GUI.contentTableRowPopout(row)}${$GUI.cellRollover(row,$OPT,$OIV)}</td>
					</tr>`;
			}
			else {
				if(!isOnTop && !$isShowing(rowType))
					continue;
				notify=( !notifyExcept && ((((rowRules[rowType]['up']&&row[$PCT5]>=rowRules[rowType]['up'])||(rowRules[rowType]['down']&&rowRules[rowType]['down']>=row[$PCT5])) && (!row[$VOL]||typeof row[$VOL]=='string'||row[$VOL]>=rowRules[rowType]['volume']) && (!_settings['l_options_only']||row[$OPT])) ));
				if(notify) {
					rowClass += ` l_notify_${isOnTop?'top_':''}${row[$PCT5]<0?'down':'up'}`;
					notifyControl = $F('f_class_title_display', ['l_notify_disable', `Disable ${$GUI.cell(row,$SYM)} notifications for today`, 'x']);
				}
				else {
					if(isOnTop)
						rowClass += ' l_top_highlight';
					if(notifyExcept)
						notifyControl = $F('f_class_title_display', ['l_notify_enable', `Re-enable ${$GUI.cell(row,$SYM)} notifications`, '&#10003;']);
					else if(isOnTop)
						notifyControl = $F('f_class_title_display', ['l_notify_disable', `Remove ${$GUI.cell(row,$SYM)} from top`, 'x']);
				}
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
				else if(row[$REL] && typeof row[$REL]=='object' && typeof row[$LNK]=='undefined') {
					row[$NWS] = `Related movers: ${row[$REL].join(', ')}`;
					row[$LNK] = i;
				}
				htmlRow = `<tr class="${rowClass}" data-ref="${i}">
					<td>${notifyControl}${$GUI.cell(row,$SYM)}</td>
					<td class="${row[$NWS]?'l_news':'l_static'}">${$GUI.cellRollover(row,$NAM,$NWS,true)}</td>
					<td class="l_history_toggle">${$GUI.cellRollover(row,$PCT5,$PCTM)}</td>
					<td class="l_history_toggle">${$GUI.cellRollover(row,$PCT,$PCTY)}</td>
					<td class="l_history_toggle">${$GUI.cellRollover(row,$PRC,$PRC5)}</td>
					<td class="l_history_toggle">${$GUI.cellRollover(row,$VOL,$VOL5)}</td>
					<td class="l_history_toggle">${i!=r?$GUI.contentTableRowPopout(row):''}${$GUI.cellRollover(row,$OPT,$OIV)}</td>
					</tr>`;
			}
			if(visibleRows >= 0 && $GUI.TABLE_SOFT_LIMIT > 0 && ++visibleRows >= $GUI.TABLE_SOFT_LIMIT)
				visibleRows = -1;
			if(isOnTop)
				onTop[row[$SYM]] = htmlRow;
			else if(notify) {
				htmlPriority += htmlRow;
				notifyRows.push(row);
			}
			else if(visibleRows >= 0)
				htmlNormal += htmlRow;
		}
		if(visibleRows >= 0 && $GUI.TABLE_SOFT_LIMIT > 0)
			$GUI.TABLE_SOFT_LIMIT = -$GUI.TABLE_SOFT_LIMIT;
		if(_assetTypes.every(type => !_settings[type]['l_show']))
			html += $F('f_no_results_row', ['No asset types are set to show in your settings.']);
		else if(!htmlNormal && !htmlPriority && !Object.keys(onTop).length) {
			let noResults='No results found', dataWithLog=($DAT.DATA['log']?$DAT.DATA:$HST.DATA.find(d=>d['log']));
			if($TOP.LOG)
				noResults += ': Log data will appear when it becomes available.';
			else if($TOP.ON && dataWithLog && $M(/#(.+)/,dataWithLog['log']))
				noResults += `: If applicable, your query will be added to the queue. (see: <a href="//${_M[1]}">${_M[1]}</a>)`;
			html += $F('f_no_results_row', [noResults]);
		}
		else {
			for(let key of Object.keys(onTop).sort((a, b) => a.localeCompare(b)))
				html += onTop[key];
			html += htmlPriority + htmlNormal;
		}
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
				if(row[$SYM]==sym && !$isHaltRow(row))
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
		const types=($TOP.ON?[$TSYM,$TRAT,$TPCT,$TPCR,$TSTR,$TEND]:[$PCT5,$PCT,$PRC,$VOL,$AGE]), stageRow=($DAT.DATA&&$DAT.DATA['items']&&$DAT.DATA['items'][idx]?$DAT.DATA['items'][idx]:null);
		let stageDataForSymbols=($TOP.ON?stageRow[$THST]:$HST.getForSymbol(stageRow[$SYM],$DAT.DATA['ts'])), hadHistoryDisplays=[];
		if(!stageDataForSymbols) return;
		if($A('.l_history_active'))
			hadHistoryDisplays = Array.from(_A).map(e => e.remove() || e.id);
		if($A('.l_history'))
			_A.forEach(e => e.classList.remove('l_history'));
		for(let type of types) {
			const historyId=`l_history_${idx}_${type}`, hadHistoryDisplay=($I(hadHistoryDisplays,historyId)>=0), isAge=(!$TOP.ON && type==$AGE);
			if(!$Q(`[data-ref='${idx}'] td:nth-of-type(${type+1})`))
				continue;
			let htmlItems=[], lastItem=null;
			stageDataForSymbols.forEach((row, idx) => {
				const isLast=(idx>=stageDataForSymbols.length-1);
				if(lastItem == $F('f_blank_line') && isLast)
					htmlItems.pop();
				else if(row && ($TOP.ON||row[$PCT5]))
					htmlItems.push(lastItem=`<div class="l_hover_container${$TOP.ON&&row[$HILT]?' l_top_searched_symbol':''}">${isAge?row.slice(-1)[0]:$GUI.cell(row,type,idx)}</div>`);
				else if(lastItem != _F && !isLast)
					htmlItems.push(lastItem=_F);
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
		let key, match, html=`${$F('f_marquee_blink')} The following hotkeys and gestures are available: ${_F} Use the <i class="l_marquee_alt">tab</i> key to toggle the site mode. ${_F} Use the <i class="l_marquee_alt">backslash</i> key to alternate animation modes. ${_F} Alt-click rows or use the <i class="l_marquee_alt">~</i> key to keep specific symbols on top. ${_F} Swipe or use <i class="l_marquee_alt">&#8644;</i> arrow keys to rewind and navigate your backlog history. ${_F} Use <i class="l_marquee_alt">&#8645;</i> arrow keys to navigate to a row followed by selecting one of these hotkeys: `;
		for(let key in _keyMap) {
			if((match=_keyMap[key][$KSTK].match(/([a-z]+)\.[a-z]+\//i)))
				html += `<div class="l_marquee_info" data-ref="${key}"><i class='l_marquee_alt_padded'>${key}</i>${$H(match[1])}</div> `
		}
		html += `${_F} Hold down the <i class="l_marquee_alt">shift</i> key to make your selection permanent. ${_F} The keys <i class="l_marquee_alt">1-7</i> can be used to sort by each column.`;
		$scrollToTop();
		$MRQ.initiate(html);
		$MRQ.intervalReset();
	}
},

/*************************************************************************************************\
\*******  FETCH & NETWORK PARSING LOGIC  ************************************  [ $NET.* ]  *******/
NET: {
	URL: null, URLS: ['//stage.larval.com', '//stage.larval.net', '//stage.larval.org'],

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
			if($TOP.ON && json['search'])
				json['items'].forEach((r,i) => json['items'][i][$TSYM] = $HST.toSummaryString(json['items'][i][$THST]));
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
			else if(minsOff < -9)
				$MRQ.flash(`Server data is unexpectedly old: <i>${Math.abs(minsOff)}</i> minutes behind.`);
			$ANI.updateFlash();
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
		if(!$isVisible() && typeof Notification != 'undefined' && Notification.permission == 'granted') {
			$NFY.NOTIFICATIONS.push(new Notification('Larval - Market volatility found!', {
				icon: '/icon-192x192.png',
				body: notifyRows.length > 0 ? 'Volatile stock(s): ' + $U(notifyRows.map(a => (typeof a[$HLT]=='string'?_char['halt']:_char[a[$PCT5]<0?'down':'up'])+a[$SYM])).join(' ') : 'Larval - Market volatility found!'
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
			else if($isHaltRow(notifyRows[0]))
				$D.title = notifyRows[0][$SYM] + ' | ' + (notifyRows[0][$HLT]?notifyRows[0][$HLT]:'HALTED');
			else
				$D.title = notifyRows[0][$SYM] + ' | ' + _char[notifyRows[0][$PCT5]<0?'down':'up'] + $N(Math.abs(notifyRows[0][$PCT5]),2) + '% | ' + _char[notifyRows[0][$PCT]<0?'down':'up'] + $N(Math.abs(notifyRows[0][$PCT]),2) + '%';
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
	forceNextStage: force => ($TOP.ON&&!$TOP.LOG&&!force) ? $CFG.buttonToggle() : $ANI.updateFlash(0.75),
	getNextSync: () => {
		if(!$DAT.DATA || !$DAT.DATA['next'])
			return($POL.LONG);
		let next = Math.floor($DAT.DATA['next'] - (new Date().getTime() / 1000)) + Math.floor(Math.random() * 10);
		if(next < 0 || next > $POL.LONG + $POL.SHORT)
			next = $POL.LONG;
		return(next);
	},
	setNextStage: (seconds, marqueeInitiate) => {
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
				$E('l_content_table').insertRow(1).innerHTML = `<tr class="l_stocks" data-ref="0">
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
