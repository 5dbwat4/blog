/**
 * Strip Post Helper
 * @author memset0 ; Modified by 5dbwat4 for better performance<me@5dbwat4.top>
 * @website https://memset0.cn
 * @description Strip post content.
 * @example
 *     <%- strip_post(content, config) %>
 */

 const default_config = {
	length: 320,
	latex: true,
	omission: '...',
};

function polishHtmlTags(content) {
	let last_length = -1;
	while (content.length != last_length) {
		last_length = content.length;
		content = content
.replace(/\<br\>/g,"\n")
.replace(/\<\/pre\>/g,"\n")
.replace(/\<\/p\>/g,"\n")
.replace(/\<\/h\d\>/g,"\n")
.replace(/(<[^<>]*?)>/g, '');
	}
	return content;
}

function isNumber(char) {
	return 48 <= char.charCodeAt(0) && char.charCodeAt(0) <= 57;
}

function isLetter(char) {
	return (65 <= char.charCodeAt(0) && char.charCodeAt(0) <= 90) || (97 <= char.charCodeAt(0) && char.charCodeAt(0) <= 122);
}

function isCounted(char) {
	return char != ' ' && char != '\t' && char != '\n';
}

function isChinese(char) {
	// escape 会对非 ascii 标准内的字符以 %u 开头存储
	return escape(char).indexOf('%u') != -1;
}

hexo.extend.helper.register('strip_post', function (content, config) {

	if (!config || typeof (config) !== 'object') {
		config = {};
	}
	config = Object.assign(default_config, config);
	content = content.split('<a id="more"></a>')[0];

	if (config.latex) {
		content = content.replace(/\<script type\=\"math\/tex\; mode\=display\"\>([\s\S]*?)\<\/script\>/g, ' $$\\displaystyle{ $1 }$$ ');;
	}
	content = polishHtmlTags(content);

	let is_in_tex = false;
	let is_after_backslash = false;
	let is_do_not_count_content = false;

	let length = 0;
	let current_cutter = -1;
	let cut_to=0

	for (let i = 0; i<config.length ; i++) {
		if (config.latex && content[i] == '$') {
			is_in_tex = !is_in_tex;
		}
		// if(content[i] == '<'){
		// 	is_do_not_count_content=true
		// 	continue
		// }
		// if(is_do_not_count_content&&content[i] != '>'){
		// 	continue
		// }
		// if(is_do_not_count_content&&content[i] == '>'){
		// 	is_do_not_count_content=false
		// 	continue
		// }
		// if(current_cutter>=content.length||current_cutter>=config.length){
		// 	cut_to=i
		// 	break
		// }

		if (is_in_tex) {
			if (content[i] == '\\') {
				is_after_backslash = !is_after_backslash;
				length += is_after_backslash; // 0 or 1
			} else {
				if (is_after_backslash) {
					if (isLetter(content[i])) {
						// 说明是 LaTeX 函数名，不应计算在长度内。
					} else {
						is_after_backslash = false;
					}
				}
				if (!is_after_backslash) {
					length += (isCounted(content[i]) && content[i] != '{' && content[i] != '}') * (1.5 + isChinese(content[i]));
				}
			}

		} else {
			
			length += isCounted(content[i]) * (1 + isChinese(content[i]));
			current_cutter = i + 1;
		}

		// console.log({ index: i, char: content[i], length });
	}

	// console.log([current_cutter, content.length, content.slice(0, 20)]);

	return (content.length <= current_cutter
		? content
		: content.slice(0, current_cutter) + config.omission).replace("\n","<br>");
});