IronbaneApp
.filter('mouthwash', [function() {

	// Create and populate the dictionary dictonary
	var dictionary = {};

	/* anus, arse, asshole, arsehole. */dictionary.anus = /\b(a+(\W|\d|_)*n+(\W|\d|_)*u+(\W|\d|_)*(5|s|z)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*r+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(3|e)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*r+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(3|e)+(\W|\d|_)*h+(\W|\d|_)*(0|o)+(\W|\d|_)*(1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*h+(\W|\d|_)*(0|o)+(\W|\d|_)*(1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*)\b|\b(a+(\.|\-|\*|_|\^|\+|\~|\`|\=|\,|\&|\@)*h+(\W|\d|_)*(0|o)+(\W|\d|_)*(1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*)\b/ig;
	/* ass */dictionary.ass = /((c|d|e|f|g|h|i|j|k|n|o|q|s|t|u|v|w|x|y|z)+(\W|\d|_)*a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*z+(\W|\d|_)*z+(\W|\d|_)*)\b|(a+(\W|\d|_)*([\$]|5)+(\W|\d|_)*([\$]|5)+(\W|\d|_)*\w*)|(a+(\W|\d|_)*([\$]|5)+(\W|\d|_)*([\$]|5)+(\W|\d|_)*)/ig;
	/* axwound */dictionary.axwound = /\b((a|@)+(\W|\d|_)*(x|k)+(e|s|z|5|)+(\W|\d|_)*(w)+(\W|\d|_)*(o|0|a|@)+(\W|\d|_)*(un)+(\W|\d|_)*(d|t))/ig;
	/* bampot */dictionary.bampot = /\b(((\w)|())+(\W|\d|_)*(b)+(\W|\d|_)*(a|@)+(\W|\d|_)*(mp)+(\W|\d|_)*(o|0)+(\W|\d|_)*(t))/ig;
	/* bareback */dictionary.bareback = /\b(b+(\W|\d|_)*a+(\W|\d|_)*r+(\W|\d|_)*(3|e)+(\W|\d|_)*b+(\W|\d|_)*a+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)+(\W|\d|_)*)/ig;
	/* beaner */dictionary.beaner = /\b(((\w)|())+(\W|\d|_)*(b)+(\W|\d|_)*(e|3)+(\W|\d|_)*(a|@|e)+(\W|\d|_)*(n)+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/ig;
	/* bitch */dictionary.bitch = /\b(b+(\W|\d|_)*i+(\W|\d|_)*a*(\W|\d|_)*(7|t)+(\W|\d|_)*(c|k)+(\W|\d|_)*h+(\W|\d|_)*)/ig;
	/* blowjob, fellatio, handjob */dictionary.blowjob = /\b(b+(\W|\d|_)*(1|l)+(\W|\d|_)*(0|o)+(\W|\d|_)*w+(\W|\d|_)*j+(\W|\d|_)*(0|o)+(\W|\d|_)*b+(\W|\d|_)*)|\b(b+(\W|\d|_)*j+(\W|\d|_)*)\b|\b(b+(\W|\d|_)*j+(\W|\d|_)*(0|o)+(\W|\d|_)*b+(\W|\d|_)*)|(f+(\W|\d|_)*(3|e)+(\W|\d|_)*(1|l)*(\W|\d|_)*(1|l)+(\W|\d|_)*a+(\W|\d|_)*(7|t)+(\W|\d|_)*(1|i)+(\W|\d|_)*(0|o)+(\W|\d|_)*)|(h+(\W|\d|_)*a+(\W|\d|_)*n+(\W|\d|_)*d+(\W|\d|_)*j+(\W|\d|_)*(0|o)+(\W|\d|_)*b+(\W|\d|_)*)/ig;
	/* bollocks, bollox */dictionary.bollocks = /\b(((\w)|())+(\W|\d|_)*(b)+(\W|\d|_)*(o|0)+(\W|\d|_)*(l|1|i)+(\W|\d|_)*(l|1|i|)+(\W|\d|_)*(o|0)+(\W|\d|_)*(x|ks|cks))/ig;
	/* boner */dictionary.boner = /\b(b+(\W|\d|_)*(0|o)+(\W|\d|_)*n+(\W|\d|_)*(3|e)+(\W|\d|_)*r+(\W|\d|_)*s*(\W|\d|_)*)\b/ig;
	/* butt, buttplug, butt-pirate */dictionary.butt = /\b((?!butter)((\w)|())+(\W|\d|_)*(b)+(\W|\d|_)*(u)+(\W|\d|_)*(t)+(t)+([^er]))/ig;
	/* camel toe */dictionary.cameltoe = /\b((c|k)+(\W|\d|_)*a+(\W|\d|_)*m+(\W|\d|_)*(3|e)+(\W|\d|_)*(1|l)+(\W|\d|_)*(7|t)+(\W|\d|_)*(0|o)+(\W|\d|_)*(3|e)+(\W|\d|_)*)/ig;
	/* carpetmuncher */dictionary.carpetmuncher = /\b(((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(a|@)+(\W|\d|_)*(rp)+(\W|\d|_)*(e|3)+(\W|\d|_)*(d|t)+(\W|\d|_)*(m)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/ig;
	/* chesticle */dictionary.chesticle = /\b(((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(e|3)+(\W|\d|_)*(s|z|5)+(\W|\d|_)*(t)+(\W|\d|_)*(i|l|1|!)+(\W|\d|_)*(c|k)+(\W|\d|_)*(i|l|1|!)+(\W|\d|_)*(e|3))/ig;
	/* chinc, chink */dictionary.chinc = /\b(((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(i|l|1)+(\W|\d|_)*(n)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k|))/ig;
	/* choad, chode */dictionary.choad = /\b(((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(o|0)+(\W|\d|_)*(a|@|d|t)+(\W|\d|_)*(t|d|e|3))/ig;
	/* clit, cunt */dictionary.cunt = /\b((?!scunthorpe)((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(l|1|!|u)+(\W|\d|_)*(i|1|!|n)+(\W|\d|_)*(t|d))/ig;
	/* cock, cawk, kock */dictionary.cock = /((c|k)+(\W|\d|_)*(0|o)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)+(\W|\d|_)*)\b|((c|k)+(\W|\d|_)*a+(\W|\d|_)*w+(\W|\d|_)*(c|k)+(\W|\d|_)*)/ig;
	/* coochie, coochy */dictionary.coochie = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*(o|0)+(\W|\d|_)*(o|0|)+(c)+(\W|\d|_)*(h)+(\W|\d|_)*(1|i|!|y)+(\W|\d|_)*(e|3|))/ig;
	/* coon */dictionary.coon = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*((o|0){2,4})+(\W|\d|_)*(n))/ig;
	/* cooter */dictionary.cooter = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*((o|0){2})+(\W|\d|_)*(t)+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/ig;
	/* cracker */dictionary.cracker = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*(r)+(\W|\d|_)*(a|@)+(\W|\d|_)*((c|k){2})+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/ig;
	/* cum */dictionary.cum = /\b((?!document)((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*(u)+(\W|\d|_)*(m))/ig;
	/* dick, dike, hardon, dildo */dictionary.dick = /\b(d+(\W|\d|_)*(1|i)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)+(\W|\d|_)*)|\b(d+(\W|\d|_)*(1|i)+(\W|\d|_)*k+(\W|\d|_)*(3|e)+(\W|\d|_)*)|\b(d+(\W|\d|_)*(1|i)+(\W|\d|_)*(1|l)+(\W|\d|_)*(1|l)*(\W|\d|_)*d+(\W|\d|_)*(0|o)+(\W|\d|_)*)|\b(d+(\W|\d|_)*y+(\W|\d|_)*(c|k)+(\W|\d|_)*(3|e)+(\W|\d|_)*)|\b(h+(\W|\d|_)*a+(\W|\d|_)*r+(\W|\d|_)*d+(0|o)+(\W|\d|_)*n+(\W|\d|_)*)\b|\b((c|k)+(\W|\d|_)*u+(\W|\d|_)*m+(\W|\d|_)*m+(\W|\d|_)*i+(\W|\d|_)*n+(\W|\d|_)*g+(\W|\d|_)*)\b/ig;
	/* cunnie, cunnilingus */dictionary.cunnie = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(n|)+(\W|\d|_)*(i|l|1!)+(\W|\d|_)*(l|1|!|e|3))/ig;
	/* dago, deggo */dictionary.dago = /\b(((\w)|())+(\W|\d|_)*(d)+(\W|\d|_)*(a|@|e|3)+(\W|\d|_)*(g)+(\W|\d|_)*(g|)+(\W|\d|_)*(o|0))/ig;
	/* damn */dictionary.damn = /\b(d+(\W|\d|_)*a+(\W|\d|_)*m+(\W|\d|_)*n+(\W|\d|_)*\w*)|\b(d+(\W|\d|_)*m+(\W|\d|_)*n+(\W|\d|_)*\w*)|\b(d+(\W|\d|_)*m+(\W|\d|_)*n+(\W|\d|_)*)\b/ig;
	/* dildo */dictionary.dildo = /\b(((\w)|())+(\W|\d|_)*(d)+(\W|\d|_)*((i|1|!){2})+(\W|\d|_)*(d)+(\W|\d|_)*(o|0))/ig;
	/* doochbag, doochbag */dictionary.doochbag = /\b(((\w)|())+(\W|\d|_)*(d)+(\W|\d|_)*(o|0)+(\W|\d|_)*(o|0|u)+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(e|3|)+(\W|\d|_)*(b)+(\W|\d|_)*(a|@)+(\W|\d|_)*(g))/ig;
	/* dookie */dictionary.dookie = /\b(((\w)|())+(\W|\d|_)*(d)+(\W|\d|_)*(o|0)+(\W|\d|_)*(o|0)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|)+(\W|\d|_)*(i|1|y)+(\W|\d|_)*(e|3|))/ig;
	/* dyke */dictionary.dyke = /\b(((\w)|())+(d)+(\W|\d|_)*(y)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|)+(\W|\d|_)*(e|3))/ig;
	/* ejaculate */dictionary.ejaculate = /\b((3|e)+(\W|\d|_)*j+(\W|\d|_)*a+(\W|\d|_)*(c|k)+(\W|\d|_)*u+(\W|\d|_)*(1|l)+(\W|\d|_)*a+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e)+(\W|\d|_)*)/ig;
	/* fag */dictionary.fag = /(f+(\W|\d|_)*a+(\W|\d|_)*g+(\W|\d|_)*)|(f+(\W|\d|_)*a+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*)|\b(f+(\W|\d|_)*(3|e)+(\W|\d|_)*g+(\W|\d|_)*)/ig;
	/* feltch */dictionary.feltch = /\b(((\w)|())+(\W|\d|_)*(f)+(\W|\d|_)*(e|3)+(\W|\d|_)*(l)+(\W|\d|_)*(t)+(\W|\d|_)*(c)+(\W|\d|_)*(h))/ig;
	/* flamer */dictionary.flamer = /\b(f+(\W|\d|_)*(1|l)+(\W|\d|_)*a+(\W|\d|_)*m+(\W|\d|_)*(3|e)+(\W|\d|_)*r+(\W|\d|_)*)\b/ig;
	/* fock */dictionary.fock = /\b((?!facebook)f+(\W|\d|_)*(0|a|o)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)+(\W|\d|_)*)\b|\b(f+(\W|\d|_)*(0|a|o)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)+(\W|\d|_)*\w*)/ig;
	/* foreskin */dictionary.foreskin = /\b(f+(\W|\d|_)*(0|o)+(\W|\d|_)*r+(\W|\d|_)*(3|e)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(c|k)+(\W|\d|_)*(1|i)+(\W|\d|_)*n+(\W|\d|_)*)\b/ig;
	/* fuck */dictionary.fuck = /\b(((\w)|())+(\W|\d|_)*(f|v)+(\W|\d|_)*(v|u|a|o)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|c))/ig;
	/* fudgepacker */dictionary.fudgepacker = /\b(((\w)|())+(\W|\d|_)*(f)+(\W|\d|_)*(u)+(\W|\d|_)*(d)+(\W|\d|_)*(g)+(\W|\d|_)*(e|3)+(\W|\d|_)*(p)+(\W|\d|_)*(a|@)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|)+(\W|\d|_)*(e|3)+(r))/ig;
	/* gay, lez, lesbian */dictionary.gay = /(g+(\W|\d|_)*a+(\W|\d|_)*y+(\W|\d|_)*)|\b(g+(\W|\d|_)*(3|e)+(\W|\d|_)*y+(\W|\d|_)*)|\b(g+(\W|\d|_)*h+(\W|\d|_)*(3|e|a)+(\W|\d|_)*y+(\W|\d|_)*)|\b((1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*z+(\W|\d|_)*)|\b((1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*b+(\W|\d|_)*)|\b(g+(\W|\d|_)*(3|e)+(\W|\d|_)*h+(\W|\d|_)*y+(\W|\d|_)*)/ig;
	/* god damn */dictionary.goddamn = /\b(g+(\W|\d|_)*(0|o)+(\W|\d|_)*d+(\W|\d|_)*d+(\W|\d|_)*a+(\W|\d|_)*(m|n)+(\W|\d|_)*\w*)/ig;
	/* gooch, gook */dictionary.gooch = /\b(((\w)|())+(\W|\d|_)*(g)+(\W|\d|_)*((o|0){2})(c)+(\W|\d|_)*(h))/ig;
	/* gringo, guido */dictionary.gringo = /\b(((\w)|())+(\W|\d|_)*(g)+(\W|\d|_)*(r)+(\W|\d|_)*(i|1)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9)+(\W|\d|_)*(o|0))/ig;
	/* heeb */dictionary.heeb = /\b(((\w)|())+(\W|\d|_)*(h)+(\W|\d|_)*((e|3){2})+(\W|\d|_)*(b))/ig;
	/* homo */dictionary.homo = /\b(((\w)|())+h+(\W|\d|_)*(o|0)+(\W|\d|_)*m+(\W|\d|_)*(o|0)+(\W|\d)*)/ig;
	/* honkey */dictionary.honkey = /\b(((\w)|())+(\W|\d|_)*(h)+(\W|\d|_)*(o|0)+(\W|\d|_)*(n)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|)+(\W|\d|_)*(e|3|i|1)+(\W|\d|_)*(y|e|3))/ig;
	/* horney, horny */dictionary.horney = /\b(h+(\W|\d|_)*(0|o)+(\W|\d|_)*r+(\W|\d|_)*n+(\W|\d|_)*(3|e)*(\W|\d|_)*(ie|y)+(\W|\d|_)*)\b/ig;
	/* humping */dictionary.humping = /\b(((\w)|())+(\W|\d|_)*(h)+(\W|\d|_)*(u)+(\W|\d|_)*(m)+(\W|\d|_)*(p)+(\W|\d|_)*(i|1)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9))\b/ig;
	/* jackoff, jerkoff, jizz, jiss */dictionary.jackoff = /\b(j+(\W|\d|_)*a+(\W|\d|_)*(c|k)+(\W|\d|_)*(0|o)+(\W|\d|_)*f+(\W|\d|_)*f+(\W|\d|_)*)\b|\b(j+(\W|\d|_)*(3|a|e)+(\W|\d|_)*r+(\W|\d|_)*(c|k)+(\W|\d|_)*(0|o)+(\W|\d|_)*f+(\W|\d|_)*f+(\W|\d|_)*)|\b(j+(\W|\d|_)*(1|i)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*\w*)/ig;
	/* jagoff */dictionary.jagoff = /\b(((\w)|())+(\W|\d|_)*(j)+(\W|\d|_)*(a|@)+(\W|\d|_)*(g|9)+(\W|\d|_)*(o|0)+(\W|\d|_)*(f)+(\W|\d|_)*(f|))\b/ig;
	/* jigaboo */dictionary.jigaboo = /\b(((\w)|())+(\W|\d|_)*(j)+(\W|\d|_)*(i|1)+(\W|\d|_)*(g|9)+(\W|\d|_)*(a|@)+(\W|\d|_)*(b|6)+(\W|\d|_)*((o|0){2}))\b/ig;
	/* jungle bunny, junglebunny */dictionary.junglebunny = /\b(((\w)|())+(\W|\d|_)*(j)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9)+(\W|\d|_)*(l|1)+(\W|\d|_)*(e|3)+(\W|\d|_)*(b)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(n|)+(\W|\d|_)*(y|i|1)+(\W|\d|_)*(e|3|))\b/ig;
	/* kike */dictionary.kike = /\b(((\w)|())+(\W|\d|_)*(k)+(\W|\d|_)*(i|1)+(\W|\d|_)*(k)+(\W|\d|_)*(e|3))\b/ig;
	/* kooch */dictionary.kooch = /\b((c|k)+(\W|\d|_)*(0|o)+(\W|\d|_)*(0|o)+(\W|\d|_)*t*(\W|\d|_)*(c|k)+(\W|\d|_)*h+(\W|\d|_)*)\b/ig;
	/* kraut */dictionary.kraut = /\b(((\w)|())+(\W|\d|_)*(k)+(\W|\d|_)*(r)+(\W|\d|_)*(a|@)+(\W|\d|_)*(u)+(\W|\d|_)*(d|t))\b/ig;
	/* kyke */dictionary.kyke = /\b(((\w)|())+(\W|\d|_)*(k)+(\W|\d|_)*(y)+(\W|\d|_)*(k)+(\W|\d|_)*(e|3))\b/ig;
	/* masturbate, wank */dictionary.masturbate = /\b(m+(\W|\d|_)*a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(7|t)+(\W|\d|_)*u+(\W|\d|_)*r+(\W|\d|_)*b+(\W|\d|_)*a+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e)+(\W|\d|_)*)|\b(m+(\W|\d|_)*a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e)*(\W|\d|_)*r+(\W|\d|_)*b(\W|\d|_)*a+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e)+(\W|\d|_)*)|\b(w+(\W|\d|_)*a+(\W|\d|_)*n+(\W|\d|_)*(c|k)+(\W|\d|_)*)/ig;
	/* milf */dictionary.milf = /b(m+(\W|\d|_)*(1|i)+(\W|\d|_)*(1|l)+(\W|\d|_)*f+(\W|\d|_)*)/ig;
	/* minge */dictionary.minge = /\b(((\w)|())+(\W|\d|_)*(m)+(\W|\d|_)*(i|1)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9)+(\W|\d|_)*(e|3))\b/ig;
	/* mofo */dictionary.mofo = /\b(m+(\W|\d|_)*(0|o)+(\W|\d|_)*f+(\W|\d|_)*(0|o)+(\W|\d|_)*)/ig;
	/* muff, muffdiver */dictionary.muff = /\b((?!muffin)((\w)|())+(\W|\d|_)*(m)+(\W|\d|_)*(u)+(\W|\d|_)*((f){2}))/ig;
	/* munging */dictionary.munging = /\b(((\w)|())+(\W|\d|_)*(m)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9)+(\W|\d|_)*(i|1)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9))\b/ig;
	/* nigger */dictionary.nigger = /\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*g+(\W|\d|_)*)|\b(n+(\W|\d|_)*(3|e)+(\W|\d|_)*g+(\W|\d|_)*g+(\W|\d|_)*)|\b(n+(\W|\d|_)*g+(\W|\d|_)*r+(\W|\d|_)*)\b|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*r+(\W|\d|_)*)|\b(n+(\W|\d|_)*(3|e)+(\W|\d|_)*g+(\W|\d|_)*r+(\W|\d|_)*)|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*(3|e)+(\W|\d|_)*r+(\W|\d|_)*)\b|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*a+(\W|\d|_)*)|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*(1|l)+(\W|\d|_)*)|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*u+(\W|\d|_)*r+(\W|\d|_)*)/ig;
	/* nutsack */dictionary.nutsack = /\b(n+(\W|\d|_)*u+(\W|\d|_)*(7|t)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*a+(\W|\d|_)*(c|k)+(\W|\d|_)*)/ig;
	/* orgasm, orgy */dictionary.orgasm = /\b((0|o)+(\W|\d|_)*r+(\W|\d|_)*g+(\W|\d|_)*a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(i|u|o|a)*(\W|\d|_)*m+(\W|\d|_)*)|\b((0|o)+(\W|\d|_)*r+(\W|\d|_)*g+(\W|\d|_)*y+(\W|\d|_)*)/ig;
	/* paki */dictionary.paki = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(a|@)+(\W|\d|_)*(k)+(\W|\d|_)*(i|1))\b/ig;
	/* panooch */dictionary.panooch = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(a|@)+(\W|\d|_)*(n)+(\W|\d|_)*((o|0){2})+(\W|\d|_)*(c|g)+(\W|\d|_)*(h|))\b/ig;
	/* pecker */dictionary.pecker = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(e|3)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k|)+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/ig;
	/* penis */dictionary.penis = /\b(p+(\W|\d|_)*(e|i)+(\W|\d|_)*n+(i|u|a|1)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*)/ig;
	/* phuck */dictionary.phuck = /\b(p+(\W|\d|_)*h+(\W|\d|_)*u+(\W|\d|_)*(c|k)*(\W|\d|_)*(c|k|v|x)+(\W|\d|_)*)/ig;
	/* piss, pissed, pissed off, pissflaps */dictionary.piss = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(i|1)+(\W|\d|_)*((s|5){2}))/ig;
	/* polesmoker */dictionary.polesmoker = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(o|0)+(\W|\d|_)*(l|1)+(\W|\d|_)*(e|3)+(\W|\d|_)*(s|5)+(\W|\d|_)*(m)+(\W|\d|_)*(o|0)+(\W|\d|_)*(k)+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))\b/ig;
	/* pollock */dictionary.pollock = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(o|0)+(\W|\d|_)*(l|1)+(\W|\d|_)*(l|1|)+(\W|\d|_)*(o|0)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|))\b/ig;
	/* poon, poonani, poonany, poontang */dictionary.poon = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*((o|0){2})+(\W|\d|_)*(n))/ig;
	/* porch monkey, porchmonkey */dictionary.porchmonkey = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(o|0)+(\W|\d|_)*(r)+(\W|\d|_)*(g|c)+(\W|\d|_)*(h|)+(\W|\d|_)*(e|3|)+(\W|\d|_)*(m)+(\W|\d|_)*(o|0)+(\W|\d|_)*(n)+(\W|\d|_)*(k)+(\W|\d|_)*(e|i|)+(\W|\d|_)*(y|e|))\b/ig;
	/* porn, pron, pr0n */dictionary.porn = /\b(p+(\W|\d|_)*(0|o)+(\W|\d|_)*r+(\W|\d|_)*n+(\W|\d|_)*(0|o)*(\W|\d|_)*(5|s|z)*(\W|\d|_)*)\b|\b(p+(\W|\d|_)*r+(\W|\d|_)*(0|o)+(\W|\d|_)*n+(\W|\d|_)*(0|o)*(\W|\d|_)*(5|s|z)*(\W|\d|_)*)\b/ig;
	/* poz */dictionary.poz = /\b(p+(\W|\d|_)*(0|o)+(\W|\d|_)*z+(\W|\d|_)*)/ig;
	/* prick */dictionary.prick = /\b(p+(\W|\d|_)*r+(\W|\d|_)*(1|i)+(\W|\d|_)*(\W|\d|_)*(c|k)+(\W|\d|_)*)\b/ig;
	/* punanny, punta */dictionary.punanny = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(t|)+(\W|\d|_)*(a|2))/ig;
	/* pussy */dictionary.pussy = /\b(p+(\W|\d|_)*u+(\W|\d|_)*(5|s|z)*(\W|\d|_)*(5|s|z)+(\W|\d|_)*(y|ie|ies)+(\W|\d|_)*)/ig;
	/* queer, queef */dictionary.queer = /\b(q+(\W|\d|_)*(w|u|i|e)+(\W|\d|_)*(r|f)+(\W|\d|_)*)/ig;
	/* rectum */dictionary.rectum = /\b(r+(\W|\d|_)*w*(\W|\d|_)*(3|e)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)*(\W|\d|_)*(7|t)+(\W|\d|_)*(0|o|u)*(\W|\d|_)*m+(\W|\d|_)*s*(\W|\d|_)*)/ig;
	/* renob */dictionary.renob = /\b(((\w)|())+(\W|\d|_)*(r)+(\W|\d|_)*(e|3)+(\W|\d|_)*(n)+(\W|\d|_)*(o|0)+(\W|\d|_)*(b))\b/ig;
	/* retard */dictionary.retard = /\b(r+(\W|\d|_)*(3|e|i)+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|a|u|e)+(\W|\d|_)*r+(\W|\d|_)*d+(\W|\d|_)*(ed|s)*(\W|\d|_)*)\b/ig;
	/* rimjob, scrotum */dictionary.scrotum = /\b(r+(\W|\d|_)*(1|i)+(\W|\d|_)*m+(\W|\d|_)*j+(\W|\d|_)*(0|o)+(\W|\d|_)*b+(\W|\d|_)*)|\b((5|s|z)+(\W|\d|_)*(c|k)+(\W|\d|_)*r+(\W|\d|_)*(0|o|u)+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e|u)+(\W|\d|_)*(m|)+(\W|\d|_)*)/ig;
	/* ruski */dictionary.ruski = /\b(((\w)|())+(\W|\d|_)*(r)+(\W|\d|_)*(u)+(\W|\d|_)*(s|5)+(\W|\d|_)*(k)+(\W|\d|_)*(y|i|1)+(\W|\d|_)*(e|3|))\b/ig;
	/* schlong */dictionary.schlong = /\b((5|s|z)+(\W|\d|_)*c*(\W|\d|_)*h+(\W|\d|_)*(1|l)+(\W|\d|_)*(0|o)+(\W|\d|_)*n+(\W|\d|_)*g+(\W|\d|_)*)/ig;
	/* screw */dictionary.screw = /\b((5|s|z)+(\W|\d|_)*(c|k)+(\W|\d|_)*r+(\W|\d|_)*(3|e)+(\W|\d|_)*w+(\W|\d|_)*\w*)/ig;
	/* semen */dictionary.semen = /\b((5|s|z)+(\W|\d|_)*(3|e)+(\W|\d|_)*m+(\W|\d|_)*(3|e|a)+(\W|\d|_)*n+(\W|\d|_)*)\b/ig;
	/* sex */dictionary.sex = /\b((5|s|z)+(\W|\d|_)*(3|e)+(\W|\d|_)*x+(\W|\d|_)*)/ig;
	/* shart */dictionary.shart = /\b((5|s|z)+(\W|\d|_)*h+(\W|\d|_)*a+(\W|\d|_)*r+(\W|\d|_)*(7|t)+(\W|\d|_)*)/ig;
	/* shit */dictionary.shit = /\b((5|s|z)+(\W|\d|_)*h+(y|i|1)+(\W|\d|_)*(7|t)+(\W|\d|_)*)/ig;
	/* shiz, shiznit, shizzle, etc */dictionary.shiz = /\b(((\w)|())+(\W|\d|_)*(s|5|z)+(\W|\d|_)*(h)+(\W|\d|_)*(i|1|!)+(\W|\d|_)*(s|5|z))/ig;
	/* skank */dictionary.skank = /\b(((\w)|())+(\W|\d|_)*(s)+(\W|\d|_)*(k|c)+(\W|\d|_)*(a|@)+(\W|\d|_)*(n)+(\W|\d|_)*(k))\b/ig;
	/* skank, slut */dictionary.slut = /\b((5|s|z)+(\W|\d|_)*(c|k)+(\W|\d|_)*a+(\W|\d|_)*n+(\W|\d|_)*(c|k)+(\W|\d|_)*)|\b((5|s|z)+(\W|\d|_)*(1|l)+(\W|\d|_)*u+(\W|\d|_)*(7|t)+(\W|\d|_)*)/ig;
	/* skeet, skat */dictionary.skeet = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(k|c)+(\W|\d|_)*(((e|3){2})|(a|@))+(\W|\d|_)*(d|t))\b/ig;
	/* smeg */dictionary.smeg = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(m)+(\W|\d|_)*(e|3)+(\W|\d|_)*(g|9))\b/ig;
	/* snatch */dictionary.snatch = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(n)+(\W|\d|_)*(a|@)+(\W|\d|_)*(t)+(\W|\d|_)*(c|g|9)+(\W|\d|_)*(h|))\b/ig;
	/* spic, spick */dictionary.spic = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(p)+(\W|\d|_)*(i|1|!)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|))\b/ig;
	/* splooge */dictionary.splooge = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(p)+(\W|\d|_)*(l|1|!)+(\W|\d|_)*((0|o){2})+(\W|\d|_)*(g|9)+(\W|\d|_)*(e|3))\b/ig;
	/* spook */dictionary.spook = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(p)+(\W|\d|_)*((o|0){2})+(\W|\d|_)*(k))\b/ig;
	/* stfu, gtfo  */dictionary.stfu = /\b((5|s|z)+(\W|\d|_)*(7|t)+(\W|\d|_)*f+(\W|\d|_)*u+(\W|\d|_)*)|\b(g+(\W|\d|_)*(7|t)+(\W|\d|_)*f+(\W|\d|_)*(0|o)+(\W|\d|_)*)/ig;
	/* testical, testicle */dictionary.testicle = /\b((7|t)+(\W|\d|_)*(3|e)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(7|t)+(\W|\d|_)*(a|i)+(\W|\d|_)*(c|k)+(\W|\d|_)*(3|a|e)*(\W|\d|_)*(1|l)+(\W|\d|_)*(3|e)*(\W|\d|_)*)/ig;
	/* tit but no other words */dictionary.tit = /\b((7|t)+(1|i)+(7|t)+)\b|\b((7|t)+(1|i)+(7|t)+(5|s|z)+)\b|\b((7|t)+(1|i)+(7|t)+y+)\b/ig;
	/* turd, terd, tard */dictionary.tard = /\b(((\w)|())+(\W|\d|_)*(t)+(\W|\d|_)*(u|e|a|@|3)+(\W|\d|_)*(r)+(\W|\d|_)*(d|t))/ig;
	/* twad */dictionary.tard = /\b(((\w)|())+(\W|\d|_)*(t|7)+(\W|\d|_)*(w)+(\W|\d|_)*(a|@)+(\W|\d|_)*(t|7))/ig;
	/* vagina */dictionary.vagina = /\b(v+(\W|\d|_)*a+(\W|\d|_)*(g|j)+(\W|\d|_)*)\b|\b(v+(\W|\d|_)*a+(\W|\d|_)*(g|j)+(\W|\d|_)*a*(\W|\d|_)*(1|i)+(\W|\d|_)*n+(\W|\d|_)*a+(\W|\d|_)*s*(\W|\d|_)*)\b/ig;
	/* wetback */dictionary.wetback = /\b(((\w)|())+(\W|\d|_)*(w)+(\W|\d|_)*(e|3)+(\W|\d|_)*(t|d)+(\W|\d|_)*(b)+(\W|\d|_)*(a|@)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|))\b/ig;
	/* whore */dictionary.whore = /\b(((\w)|())+(\W|\d|_)*(w|)+(\W|\d|_)*(h)+(\W|\d|_)*(o|0)+(a|)+(\W|\d|_)*(r)+(\W|\d|_)*(e|3))/ig;

   return function(input) {
        if (!input) {
            return;
        }

        var clean = " " + input + " ";

        angular.forEach(dictionary, function(word) {
                clean = clean.replace(word, " *** ");
        });

        return clean;
    };
}]);
