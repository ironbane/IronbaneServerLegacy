/*
    This file is part of Ironbane MMO.

    Ironbane MMO is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ironbane MMO is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ironbane MMO.  If not, see <http://www.gnu.org/licenses/>.
*/

// Create and populate the dictionary dictonary
var dictionary = {};

/* anus, arse, asshole, arsehole. */dictionary.anus = /\b(a+(\W|\d|_)*n+(\W|\d|_)*u+(\W|\d|_)*(5|s|z)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*r+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(3|e)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*r+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(3|e)+(\W|\d|_)*h+(\W|\d|_)*(0|o)+(\W|\d|_)*(1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*h+(\W|\d|_)*(0|o)+(\W|\d|_)*(1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*)\b|\b(a+(\.|\-|\*|_|\^|\+|\~|\`|\=|\,|\&|\@)*h+(\W|\d|_)*(0|o)+(\W|\d|_)*(1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*)\b/i;
/* ass */dictionary.ass = /((c|d|e|f|g|h|i|j|k|n|o|q|s|t|u|v|w|x|y|z)+(\W|\d|_)*a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*)\b|\b(a+(\W|\d|_)*z+(\W|\d|_)*z+(\W|\d|_)*)\b|(a+(\W|\d|_)*([\$]|5)+(\W|\d|_)*([\$]|5)+(\W|\d|_)*\w*)|(a+(\W|\d|_)*([\$]|5)+(\W|\d|_)*([\$]|5)+(\W|\d|_)*)/i;
/* axwound */dictionary.axwound = /\b((a|@)+(\W|\d|_)*(x|k)+(e|s|z|5|)+(\W|\d|_)*(w)+(\W|\d|_)*(o|0|a|@)+(\W|\d|_)*(un)+(\W|\d|_)*(d|t))/i;
/* bampot */dictionary.bampot = /\b(((\w)|())+(\W|\d|_)*(b)+(\W|\d|_)*(a|@)+(\W|\d|_)*(mp)+(\W|\d|_)*(o|0)+(\W|\d|_)*(t))/i;
/* bareback */dictionary.bareback = /\b(b+(\W|\d|_)*a+(\W|\d|_)*r+(\W|\d|_)*(3|e)+(\W|\d|_)*b+(\W|\d|_)*a+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)+(\W|\d|_)*)/i;
/* beaner */dictionary.beaner = /\b(((\w)|())+(\W|\d|_)*(b)+(\W|\d|_)*(e|3)+(\W|\d|_)*(a|@|e)+(\W|\d|_)*(n)+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/i;
/* bitch */dictionary.bitch = /\b(b+(\W|\d|_)*i+(\W|\d|_)*a*(\W|\d|_)*(7|t)+(\W|\d|_)*(c|k)+(\W|\d|_)*h+(\W|\d|_)*)/i;
/* blowjob, fellatio, handjob */dictionary.blowjob = /\b(b+(\W|\d|_)*(1|l)+(\W|\d|_)*(0|o)+(\W|\d|_)*w+(\W|\d|_)*j+(\W|\d|_)*(0|o)+(\W|\d|_)*b+(\W|\d|_)*)|\b(b+(\W|\d|_)*j+(\W|\d|_)*)\b|\b(b+(\W|\d|_)*j+(\W|\d|_)*(0|o)+(\W|\d|_)*b+(\W|\d|_)*)|(f+(\W|\d|_)*(3|e)+(\W|\d|_)*(1|l)*(\W|\d|_)*(1|l)+(\W|\d|_)*a+(\W|\d|_)*(7|t)+(\W|\d|_)*(1|i)+(\W|\d|_)*(0|o)+(\W|\d|_)*)|(h+(\W|\d|_)*a+(\W|\d|_)*n+(\W|\d|_)*d+(\W|\d|_)*j+(\W|\d|_)*(0|o)+(\W|\d|_)*b+(\W|\d|_)*)/i;
/* bollocks, bollox */dictionary.bollocks = /\b(((\w)|())+(\W|\d|_)*(b)+(\W|\d|_)*(o|0)+(\W|\d|_)*(l|1|i)+(\W|\d|_)*(l|1|i|)+(\W|\d|_)*(o|0)+(\W|\d|_)*(x|ks|cks))/i;
/* boner */dictionary.boner = /\b(b+(\W|\d|_)*(0|o)+(\W|\d|_)*n+(\W|\d|_)*(3|e)+(\W|\d|_)*r+(\W|\d|_)*s*(\W|\d|_)*)\b/i;
/* butt, buttplug, butt-pirate */dictionary.butt = /\b((?!butter)((\w)|())+(\W|\d|_)*(b)+(\W|\d|_)*(u)+(\W|\d|_)*(t)+(t)+([^er]))/i;
/* camel toe */dictionary.cameltoe = /\b((c|k)+(\W|\d|_)*a+(\W|\d|_)*m+(\W|\d|_)*(3|e)+(\W|\d|_)*(1|l)+(\W|\d|_)*(7|t)+(\W|\d|_)*(0|o)+(\W|\d|_)*(3|e)+(\W|\d|_)*)/i;
/* carpetmuncher */dictionary.carpetmuncher = /\b(((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(a|@)+(\W|\d|_)*(rp)+(\W|\d|_)*(e|3)+(\W|\d|_)*(d|t)+(\W|\d|_)*(m)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/i;
/* chesticle */dictionary.chesticle = /\b(((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(e|3)+(\W|\d|_)*(s|z|5)+(\W|\d|_)*(t)+(\W|\d|_)*(i|l|1|!)+(\W|\d|_)*(c|k)+(\W|\d|_)*(i|l|1|!)+(\W|\d|_)*(e|3))/i;
/* chinc, chink */dictionary.chinc = /\b(((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(i|l|1)+(\W|\d|_)*(n)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k|))/i;
/* choad, chode */dictionary.choad = /\b(((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(o|0)+(\W|\d|_)*(a|@|d|t)+(\W|\d|_)*(t|d|e|3))/i;
/* clit, cunt */dictionary.cunt = /\b((?!scunthorpe)((\w)|())+(\W|\d|_)*(c)+(\W|\d|_)*(l|1|!|u)+(\W|\d|_)*(i|1|!|n)+(\W|\d|_)*(t|d))/i;
/* cock, cawk, kock */dictionary.cock = /((c|k)+(\W|\d|_)*(0|o)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)+(\W|\d|_)*)\b|((c|k)+(\W|\d|_)*a+(\W|\d|_)*w+(\W|\d|_)*(c|k)+(\W|\d|_)*)/i;
/* coochie, coochy */dictionary.coochie = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*(o|0)+(\W|\d|_)*(o|0|)+(c)+(\W|\d|_)*(h)+(\W|\d|_)*(1|i|!|y)+(\W|\d|_)*(e|3|))/i;
/* coon */dictionary.coon = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*((o|0){2,4})+(\W|\d|_)*(n))/i;
/* cooter */dictionary.cooter = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*((o|0){2})+(\W|\d|_)*(t)+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/i;
/* cracker */dictionary.cracker = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*(r)+(\W|\d|_)*(a|@)+(\W|\d|_)*((c|k){2})+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/i;
/* cum */dictionary.cum = /\b((?!document)((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*(u)+(\W|\d|_)*(m))/i;
/* dick, dike, hardon, dildo */dictionary.dick = /\b(d+(\W|\d|_)*(1|i)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)+(\W|\d|_)*)|\b(d+(\W|\d|_)*(1|i)+(\W|\d|_)*k+(\W|\d|_)*(3|e)+(\W|\d|_)*)|\b(d+(\W|\d|_)*(1|i)+(\W|\d|_)*(1|l)+(\W|\d|_)*(1|l)*(\W|\d|_)*d+(\W|\d|_)*(0|o)+(\W|\d|_)*)|\b(d+(\W|\d|_)*y+(\W|\d|_)*(c|k)+(\W|\d|_)*(3|e)+(\W|\d|_)*)|\b(h+(\W|\d|_)*a+(\W|\d|_)*r+(\W|\d|_)*d+(0|o)+(\W|\d|_)*n+(\W|\d|_)*)\b|\b((c|k)+(\W|\d|_)*u+(\W|\d|_)*m+(\W|\d|_)*m+(\W|\d|_)*i+(\W|\d|_)*n+(\W|\d|_)*g+(\W|\d|_)*)\b/i;
/* cunnie, cunnilingus */dictionary.cunnie = /\b(((\w)|())+(\W|\d|_)*(c|k)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(n|)+(\W|\d|_)*(i|l|1!)+(\W|\d|_)*(l|1|!|e|3))/i;
/* dago, deggo */dictionary.dago = /\b(((\w)|())+(\W|\d|_)*(d)+(\W|\d|_)*(a|@|e|3)+(\W|\d|_)*(g)+(\W|\d|_)*(g|)+(\W|\d|_)*(o|0))/i;
/* damn */dictionary.damn = /\b(d+(\W|\d|_)*a+(\W|\d|_)*m+(\W|\d|_)*n+(\W|\d|_)*\w*)|\b(d+(\W|\d|_)*m+(\W|\d|_)*n+(\W|\d|_)*\w*)|\b(d+(\W|\d|_)*m+(\W|\d|_)*n+(\W|\d|_)*)\b/i;
/* dildo */dictionary.dildo = /\b(((\w)|())+(\W|\d|_)*(d)+(\W|\d|_)*((i|1|!){2})+(\W|\d|_)*(d)+(\W|\d|_)*(o|0))/i;
/* doochbag, doochbag */dictionary.doochbag = /\b(((\w)|())+(\W|\d|_)*(d)+(\W|\d|_)*(o|0)+(\W|\d|_)*(o|0|u)+(\W|\d|_)*(c)+(\W|\d|_)*(h)+(\W|\d|_)*(e|3|)+(\W|\d|_)*(b)+(\W|\d|_)*(a|@)+(\W|\d|_)*(g))/i;
/* dookie */dictionary.dookie = /\b(((\w)|())+(\W|\d|_)*(d)+(\W|\d|_)*(o|0)+(\W|\d|_)*(o|0)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|)+(\W|\d|_)*(i|1|y)+(\W|\d|_)*(e|3|))/i;
/* dyke */dictionary.dyke = /\b(((\w)|())+(d)+(\W|\d|_)*(y)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|)+(\W|\d|_)*(e|3))/i;
/* ejaculate */dictionary.ejaculate = /\b((3|e)+(\W|\d|_)*j+(\W|\d|_)*a+(\W|\d|_)*(c|k)+(\W|\d|_)*u+(\W|\d|_)*(1|l)+(\W|\d|_)*a+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e)+(\W|\d|_)*)/i;
/* fag */dictionary.fag = /(f+(\W|\d|_)*a+(\W|\d|_)*g+(\W|\d|_)*)|(f+(\W|\d|_)*a+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*)|\b(f+(\W|\d|_)*(3|e)+(\W|\d|_)*g+(\W|\d|_)*)/i;
/* feltch */dictionary.feltch = /\b(((\w)|())+(\W|\d|_)*(f)+(\W|\d|_)*(e|3)+(\W|\d|_)*(l)+(\W|\d|_)*(t)+(\W|\d|_)*(c)+(\W|\d|_)*(h))/i;
/* flamer */dictionary.flamer = /\b(f+(\W|\d|_)*(1|l)+(\W|\d|_)*a+(\W|\d|_)*m+(\W|\d|_)*(3|e)+(\W|\d|_)*r+(\W|\d|_)*)\b/i;
/* foreskin */dictionary.foreskin = /\b(f+(\W|\d|_)*(0|o)+(\W|\d|_)*r+(\W|\d|_)*(3|e)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(c|k)+(\W|\d|_)*(1|i)+(\W|\d|_)*n+(\W|\d|_)*)\b/i;
/* fuck */dictionary.fuck = /\b^(?!face)(((\w)|())+(\W|\d|_)*(f|v)+(\W|\d|_)*(v|u|a|o)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|c|))/i;
/* fudgepacker */dictionary.fudgepacker = /\b(((\w)|())+(\W|\d|_)*(f)+(\W|\d|_)*(u)+(\W|\d|_)*(d)+(\W|\d|_)*(g)+(\W|\d|_)*(e|3)+(\W|\d|_)*(p)+(\W|\d|_)*(a|@)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|)+(\W|\d|_)*(e|3)+(r))/i;
/* gay, lez, lesbian */dictionary.gay = /(g+(\W|\d|_)*a+(\W|\d|_)*y+(\W|\d|_)*)|\b(g+(\W|\d|_)*(3|e)+(\W|\d|_)*y+(\W|\d|_)*)|\b(g+(\W|\d|_)*h+(\W|\d|_)*(3|e|a)+(\W|\d|_)*y+(\W|\d|_)*)|\b((1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*z+(\W|\d|_)*)|\b((1|l)+(\W|\d|_)*(3|e)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*b+(\W|\d|_)*)|\b(g+(\W|\d|_)*(3|e)+(\W|\d|_)*h+(\W|\d|_)*y+(\W|\d|_)*)/i;
/* god damn */dictionary.goddamn = /\b(g+(\W|\d|_)*(0|o)+(\W|\d|_)*d+(\W|\d|_)*d+(\W|\d|_)*a+(\W|\d|_)*(m|n)+(\W|\d|_)*\w*)/i;
/* gooch, gook */dictionary.gooch = /\b(((\w)|())+(\W|\d|_)*(g)+(\W|\d|_)*((o|0){2})(c)+(\W|\d|_)*(h))/i;
/* gringo, guido */dictionary.gringo = /\b(((\w)|())+(\W|\d|_)*(g)+(\W|\d|_)*(r)+(\W|\d|_)*(i|1)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9)+(\W|\d|_)*(o|0))/i;
/* heeb */dictionary.heeb = /\b(((\w)|())+(\W|\d|_)*(h)+(\W|\d|_)*((e|3){2})+(\W|\d|_)*(b))/i;
/* homo */dictionary.homo = /\b(((\w)|())+h+(\W|\d|_)*(o|0)+(\W|\d|_)*m+(\W|\d|_)*(o|0)+(\W|\d)*)/i;
/* honkey */dictionary.honkey = /\b(((\w)|())+(\W|\d|_)*(h)+(\W|\d|_)*(o|0)+(\W|\d|_)*(n)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|)+(\W|\d|_)*(e|3|i|1)+(\W|\d|_)*(y|e|3))/i;
/* horney, horny */dictionary.horney = /\b(h+(\W|\d|_)*(0|o)+(\W|\d|_)*r+(\W|\d|_)*n+(\W|\d|_)*(3|e)*(\W|\d|_)*(ie|y)+(\W|\d|_)*)\b/i;
/* humping */dictionary.humping = /\b(((\w)|())+(\W|\d|_)*(h)+(\W|\d|_)*(u)+(\W|\d|_)*(m)+(\W|\d|_)*(p)+(\W|\d|_)*(i|1)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9))\b/i;
/* jackoff, jerkoff, jizz, jiss */dictionary.jackoff = /\b(j+(\W|\d|_)*a+(\W|\d|_)*(c|k)+(\W|\d|_)*(0|o)+(\W|\d|_)*f+(\W|\d|_)*f+(\W|\d|_)*)\b|\b(j+(\W|\d|_)*(3|a|e)+(\W|\d|_)*r+(\W|\d|_)*(c|k)+(\W|\d|_)*(0|o)+(\W|\d|_)*f+(\W|\d|_)*f+(\W|\d|_)*)|\b(j+(\W|\d|_)*(1|i)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*\w*)/i;
/* jagoff */dictionary.jagoff = /\b(((\w)|())+(\W|\d|_)*(j)+(\W|\d|_)*(a|@)+(\W|\d|_)*(g|9)+(\W|\d|_)*(o|0)+(\W|\d|_)*(f)+(\W|\d|_)*(f|))\b/i;
/* jigaboo */dictionary.jigaboo = /\b(((\w)|())+(\W|\d|_)*(j)+(\W|\d|_)*(i|1)+(\W|\d|_)*(g|9)+(\W|\d|_)*(a|@)+(\W|\d|_)*(b|6)+(\W|\d|_)*((o|0){2}))\b/i;
/* jungle bunny, junglebunny */dictionary.junglebunny = /\b(((\w)|())+(\W|\d|_)*(j)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9)+(\W|\d|_)*(l|1)+(\W|\d|_)*(e|3)+(\W|\d|_)*(b)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(n|)+(\W|\d|_)*(y|i|1)+(\W|\d|_)*(e|3|))\b/i;
/* kike */dictionary.kike = /\b(((\w)|())+(\W|\d|_)*(k)+(\W|\d|_)*(i|1)+(\W|\d|_)*(k)+(\W|\d|_)*(e|3))\b/i;
/* kooch */dictionary.kooch = /\b((c|k)+(\W|\d|_)*(0|o)+(\W|\d|_)*(0|o)+(\W|\d|_)*t*(\W|\d|_)*(c|k)+(\W|\d|_)*h+(\W|\d|_)*)\b/i;
/* kraut */dictionary.kraut = /\b(((\w)|())+(\W|\d|_)*(k)+(\W|\d|_)*(r)+(\W|\d|_)*(a|@)+(\W|\d|_)*(u)+(\W|\d|_)*(d|t))\b/i;
/* kyke */dictionary.kyke = /\b(((\w)|())+(\W|\d|_)*(k)+(\W|\d|_)*(y)+(\W|\d|_)*(k)+(\W|\d|_)*(e|3))\b/i;
/* masturbate, wank */dictionary.masturbate = /\b(m+(\W|\d|_)*a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(7|t)+(\W|\d|_)*u+(\W|\d|_)*r+(\W|\d|_)*b+(\W|\d|_)*a+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e)+(\W|\d|_)*)|\b(m+(\W|\d|_)*a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e)*(\W|\d|_)*r+(\W|\d|_)*b(\W|\d|_)*a+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e)+(\W|\d|_)*)|\b(w+(\W|\d|_)*a+(\W|\d|_)*n+(\W|\d|_)*(c|k)+(\W|\d|_)*)/i;
/* milf */dictionary.milf = /b(m+(\W|\d|_)*(1|i)+(\W|\d|_)*(1|l)+(\W|\d|_)*f+(\W|\d|_)*)/i;
/* minge */dictionary.minge = /\b(((\w)|())+(\W|\d|_)*(m)+(\W|\d|_)*(i|1)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9)+(\W|\d|_)*(e|3))\b/i;
/* mofo */dictionary.mofo = /\b(m+(\W|\d|_)*(0|o)+(\W|\d|_)*f+(\W|\d|_)*(0|o)+(\W|\d|_)*)/i;
/* muff, muffdiver */dictionary.muff = /\b((?!muffin)((\w)|())+(\W|\d|_)*(m)+(\W|\d|_)*(u)+(\W|\d|_)*((f){2}))/i;
/* munging */dictionary.munging = /\b(((\w)|())+(\W|\d|_)*(m)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9)+(\W|\d|_)*(i|1)+(\W|\d|_)*(n)+(\W|\d|_)*(g|9))\b/i;
/* nigger */dictionary.nigger = /\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*g+(\W|\d|_)*)|\b(n+(\W|\d|_)*(3|e)+(\W|\d|_)*g+(\W|\d|_)*g+(\W|\d|_)*)|\b(n+(\W|\d|_)*g+(\W|\d|_)*r+(\W|\d|_)*)\b|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*r+(\W|\d|_)*)|\b(n+(\W|\d|_)*(3|e)+(\W|\d|_)*g+(\W|\d|_)*r+(\W|\d|_)*)|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*(3|e)+(\W|\d|_)*r+(\W|\d|_)*)\b|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*a+(\W|\d|_)*)|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*(1|l)+(\W|\d|_)*)|\b(n+(\W|\d|_)*(1|i)+(\W|\d|_)*g+(\W|\d|_)*u+(\W|\d|_)*r+(\W|\d|_)*)/i;
/* nutsack */dictionary.nutsack = /\b(n+(\W|\d|_)*u+(\W|\d|_)*(7|t)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*a+(\W|\d|_)*(c|k)+(\W|\d|_)*)/i;
/* orgasm, orgy */dictionary.orgasm = /\b((0|o)+(\W|\d|_)*r+(\W|\d|_)*g+(\W|\d|_)*a+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(i|u|o|a)*(\W|\d|_)*m+(\W|\d|_)*)|\b((0|o)+(\W|\d|_)*r+(\W|\d|_)*g+(\W|\d|_)*y+(\W|\d|_)*)/i;
/* paki */dictionary.paki = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(a|@)+(\W|\d|_)*(k)+(\W|\d|_)*(i|1))\b/i;
/* panooch */dictionary.panooch = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(a|@)+(\W|\d|_)*(n)+(\W|\d|_)*((o|0){2})+(\W|\d|_)*(c|g)+(\W|\d|_)*(h|))\b/i;
/* pecker */dictionary.pecker = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(e|3)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k|)+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))/i;
/* penis */dictionary.penis = /\b(p+(\W|\d|_)*(e|i)+(\W|\d|_)*n+(i|u|a|1)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*)/i;
/* phuck */dictionary.phuck = /\b(p+(\W|\d|_)*h+(\W|\d|_)*u+(\W|\d|_)*(c|k)*(\W|\d|_)*(c|k|v|x)+(\W|\d|_)*)/i;
/* piss, pissed, pissed off, pissflaps */dictionary.piss = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(i|1)+(\W|\d|_)*((s|5){2}))/i;
/* polesmoker */dictionary.polesmoker = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(o|0)+(\W|\d|_)*(l|1)+(\W|\d|_)*(e|3)+(\W|\d|_)*(s|5)+(\W|\d|_)*(m)+(\W|\d|_)*(o|0)+(\W|\d|_)*(k)+(\W|\d|_)*(e|3)+(\W|\d|_)*(r))\b/i;
/* pollock */dictionary.pollock = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(o|0)+(\W|\d|_)*(l|1)+(\W|\d|_)*(l|1|)+(\W|\d|_)*(o|0)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|))\b/i;
/* poon, poonani, poonany, poontang */dictionary.poon = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*((o|0){2})+(\W|\d|_)*(n))/i;
/* porch monkey, porchmonkey */dictionary.porchmonkey = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(o|0)+(\W|\d|_)*(r)+(\W|\d|_)*(g|c)+(\W|\d|_)*(h|)+(\W|\d|_)*(e|3|)+(\W|\d|_)*(m)+(\W|\d|_)*(o|0)+(\W|\d|_)*(n)+(\W|\d|_)*(k)+(\W|\d|_)*(e|i|)+(\W|\d|_)*(y|e|))\b/i;
/* porn, pron, pr0n */dictionary.porn = /\b(p+(\W|\d|_)*(0|o)+(\W|\d|_)*r+(\W|\d|_)*n+(\W|\d|_)*(0|o)*(\W|\d|_)*(5|s|z)*(\W|\d|_)*)\b|\b(p+(\W|\d|_)*r+(\W|\d|_)*(0|o)+(\W|\d|_)*n+(\W|\d|_)*(0|o)*(\W|\d|_)*(5|s|z)*(\W|\d|_)*)\b/i;
/* poz */dictionary.poz = /\b(p+(\W|\d|_)*(0|o)+(\W|\d|_)*z+(\W|\d|_)*)/i;
/* prick */dictionary.prick = /\b(p+(\W|\d|_)*r+(\W|\d|_)*(1|i)+(\W|\d|_)*(\W|\d|_)*(c|k)+(\W|\d|_)*)\b/i;
/* punanny, punta */dictionary.punanny = /\b(((\w)|())+(\W|\d|_)*(p)+(\W|\d|_)*(u)+(\W|\d|_)*(n)+(\W|\d|_)*(t|)+(\W|\d|_)*(a|2))/i;
/* pussy */dictionary.pussy = /\b(p+(\W|\d|_)*u+(\W|\d|_)*(5|s|z)*(\W|\d|_)*(5|s|z)+(\W|\d|_)*(y|ie|ies)+(\W|\d|_)*)/i;
/* queer, queef */dictionary.queer = /\b(q+(\W|\d|_)*(w|u|i|e)+(\W|\d|_)*(r|f)+(\W|\d|_)*)/i;
/* rectum */dictionary.rectum = /\b(r+(\W|\d|_)*w*(\W|\d|_)*(3|e)+(\W|\d|_)*(c|k)+(\W|\d|_)*(c|k)*(\W|\d|_)*(7|t)+(\W|\d|_)*(0|o|u)*(\W|\d|_)*m+(\W|\d|_)*s*(\W|\d|_)*)/i;
/* renob */dictionary.renob = /\b(((\w)|())+(\W|\d|_)*(r)+(\W|\d|_)*(e|3)+(\W|\d|_)*(n)+(\W|\d|_)*(o|0)+(\W|\d|_)*(b))\b/i;
/* retard */dictionary.retard = /\b(r+(\W|\d|_)*(3|e|i)+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|a|u|e)+(\W|\d|_)*r+(\W|\d|_)*d+(\W|\d|_)*(ed|s)*(\W|\d|_)*)\b/i;
/* rimjob, scrotum */dictionary.scrotum = /\b(r+(\W|\d|_)*(1|i)+(\W|\d|_)*m+(\W|\d|_)*j+(\W|\d|_)*(0|o)+(\W|\d|_)*b+(\W|\d|_)*)|\b((5|s|z)+(\W|\d|_)*(c|k)+(\W|\d|_)*r+(\W|\d|_)*(0|o|u)+(\W|\d|_)*(7|t)+(\W|\d|_)*(3|e|u)+(\W|\d|_)*(m|)+(\W|\d|_)*)/i;
/* ruski */dictionary.ruski = /\b(((\w)|())+(\W|\d|_)*(r)+(\W|\d|_)*(u)+(\W|\d|_)*(s|5)+(\W|\d|_)*(k)+(\W|\d|_)*(y|i|1)+(\W|\d|_)*(e|3|))\b/i;
/* schlong */dictionary.schlong = /\b((5|s|z)+(\W|\d|_)*c*(\W|\d|_)*h+(\W|\d|_)*(1|l)+(\W|\d|_)*(0|o)+(\W|\d|_)*n+(\W|\d|_)*g+(\W|\d|_)*)/i;
/* screw */dictionary.screw = /\b((5|s|z)+(\W|\d|_)*(c|k)+(\W|\d|_)*r+(\W|\d|_)*(3|e)+(\W|\d|_)*w+(\W|\d|_)*\w*)/i;
/* semen */dictionary.semen = /\b((5|s|z)+(\W|\d|_)*(3|e)+(\W|\d|_)*m+(\W|\d|_)*(3|e|a)+(\W|\d|_)*n+(\W|\d|_)*)\b/i;
/* sex */dictionary.sex = /\b((5|s|z)+(\W|\d|_)*(3|e)+(\W|\d|_)*x+(\W|\d|_)*)/i;
/* shart */dictionary.shart = /\b((5|s|z)+(\W|\d|_)*h+(\W|\d|_)*a+(\W|\d|_)*r+(\W|\d|_)*(7|t)+(\W|\d|_)*)/i;
/* shit */dictionary.shit = /\b((5|s|z)+(\W|\d|_)*h+(y|i|1)+(\W|\d|_)*(7|t)+(\W|\d|_)*)/i;
/* shiz, shiznit, shizzle, etc */dictionary.shiz = /\b(((\w)|())+(\W|\d|_)*(s|5|z)+(\W|\d|_)*(h)+(\W|\d|_)*(i|1|!)+(\W|\d|_)*(s|5|z))/i;
/* skank */dictionary.skank = /\b(((\w)|())+(\W|\d|_)*(s)+(\W|\d|_)*(k|c)+(\W|\d|_)*(a|@)+(\W|\d|_)*(n)+(\W|\d|_)*(k))\b/i;
/* skank, slut */dictionary.slut = /\b((5|s|z)+(\W|\d|_)*(c|k)+(\W|\d|_)*a+(\W|\d|_)*n+(\W|\d|_)*(c|k)+(\W|\d|_)*)|\b((5|s|z)+(\W|\d|_)*(1|l)+(\W|\d|_)*u+(\W|\d|_)*(7|t)+(\W|\d|_)*)/i;
/* skeet, skat */dictionary.skeet = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(k|c)+(\W|\d|_)*(((e|3){2})|(a|@))+(\W|\d|_)*(d|t))\b/i;
/* smeg */dictionary.smeg = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(m)+(\W|\d|_)*(e|3)+(\W|\d|_)*(g|9))\b/i;
/* snatch */dictionary.snatch = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(n)+(\W|\d|_)*(a|@)+(\W|\d|_)*(t)+(\W|\d|_)*(c|g|9)+(\W|\d|_)*(h|))\b/i;
/* spic, spick */dictionary.spic = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(p)+(\W|\d|_)*(i|1|!)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|))\b/i;
/* splooge */dictionary.splooge = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(p)+(\W|\d|_)*(l|1|!)+(\W|\d|_)*((0|o){2})+(\W|\d|_)*(g|9)+(\W|\d|_)*(e|3))\b/i;
/* spook */dictionary.spook = /\b(((\w)|())+(\W|\d|_)*(s|5)+(\W|\d|_)*(p)+(\W|\d|_)*((o|0){2})+(\W|\d|_)*(k))\b/i;
/* stfu, gtfo  */dictionary.stfu = /\b((5|s|z)+(\W|\d|_)*(7|t)+(\W|\d|_)*f+(\W|\d|_)*u+(\W|\d|_)*)|\b(g+(\W|\d|_)*(7|t)+(\W|\d|_)*f+(\W|\d|_)*(0|o)+(\W|\d|_)*)/i;
/* testical, testicle */dictionary.testicle = /\b((7|t)+(\W|\d|_)*(3|e)+(\W|\d|_)*(5|s|z)+(\W|\d|_)*(7|t)+(\W|\d|_)*(a|i)+(\W|\d|_)*(c|k)+(\W|\d|_)*(3|a|e)*(\W|\d|_)*(1|l)+(\W|\d|_)*(3|e)*(\W|\d|_)*)/i;
/* tit but no other words */dictionary.tit = /\b((7|t)+(1|i)+(7|t)+)\b|\b((7|t)+(1|i)+(7|t)+(5|s|z)+)\b|\b((7|t)+(1|i)+(7|t)+y+)\b/i;
/* turd, terd, tard */dictionary.tard = /\b(((\w)|())+(\W|\d|_)*(t)+(\W|\d|_)*(u|e|a|@|3)+(\W|\d|_)*(r)+(\W|\d|_)*(d|t))/i;
/* twad */dictionary.tard = /\b(((\w)|())+(\W|\d|_)*(t|7)+(\W|\d|_)*(w)+(\W|\d|_)*(a|@)+(\W|\d|_)*(t|7))/i;
/* vagina */dictionary.vagina = /\b(v+(\W|\d|_)*a+(\W|\d|_)*(g|j)+(\W|\d|_)*)\b|\b(v+(\W|\d|_)*a+(\W|\d|_)*(g|j)+(\W|\d|_)*a*(\W|\d|_)*(1|i)+(\W|\d|_)*n+(\W|\d|_)*a+(\W|\d|_)*s*(\W|\d|_)*)\b/i;
/* wetback */dictionary.wetback = /\b(((\w)|())+(\W|\d|_)*(w)+(\W|\d|_)*(e|3)+(\W|\d|_)*(t|d)+(\W|\d|_)*(b)+(\W|\d|_)*(a|@)+(\W|\d|_)*(c|k)+(\W|\d|_)*(k|))\b/i;
/* whore */dictionary.whore = /\b(((\w)|())+(\W|\d|_)*(w|)+(\W|\d|_)*(h)+(\W|\d|_)*(o|0)+(a|)+(\W|\d|_)*(r)+(\W|\d|_)*(e|3))/i;

module.exports = dictionary;

