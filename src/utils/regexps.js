// eslint-disable-next-line max-len,no-useless-escape
export const messageUrlRegExp = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9а-я]+([\-\.]{1}[a-z0-9а-я]+)*\.(ink|academy|accountant|accountants|active|actor|adult|aero|agency|airforce|apartments|app|archi|army|associates|asia|attorney|auction|audio|autos|biz|cat|com|coop|dance|edu|eus|family|gov|info|int|jobs|mil|mobi|museum|name|net|one|ong|onl|online|ooo|org|organic|partners|parts|party|pharmacy|photo|photography|photos|physio|pics|pictures|feedback|pink|pizza|place|plumbing|plus|poker|porn|post|press|pro|productions|prof|properties|property|qpon|racing|recipes|red|rehab|ren|rent|rentals|repair|report|republican|rest|review|reviews|rich|site|tel|trade|travel|xxx|xyz|yoga|zone|ninja|art|moe|dev|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|бел|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kd|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|мон|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|срб|ru|рф|rw|sa|sb|sc|sd|se|sg|shop|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|укр|ug|uk|us|uy|uz|va|vc|ve|vg|vip|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)(:[0-9]{1,5})?((\/|\?)[a-zа-я0-9\/\.\?\=%\+\&-_]+)?/igm;
/* we also must put spaces between links, and cause of that it's simple way to detect existing spaces between <img /> */
export const imgTagWithSpacesRegExp = / ?<img([а-я\w\W]+?)*?[\\/]?> ?/gi;

export const imgTagRegExp = /<img([а-я\w\W]+?)*?[\\/]?>/gi;

export const phoneRegExp = /((\+?7)|(8))[0-9]{10}/;

export const uglyUrlRegExp = /(?:http(s)?:\/\/)\S*/;
