export class WordLink
{
	protected _word: string | null;
	protected _num: number;

	get word() { return this._word; }
	get num() { return this._num; }

	constructor(word: string | null, num: number)
	{
		this._word = word;
		this._num = num;
	}

	increment()
	{
		return ++this._num;
	}
}

export default class Chatty
{
	protected wordGraph: { [word: string]: WordLink[] } = {};

	addLink(a: string, b: string | null)
	{
		const links = this.wordGraph[a] ?? (this.wordGraph[a] = []);
		const link = links.find(v => v.word === b) ?? new WordLink(b, 0);
		link.increment();
		if(link.num === 1) links.push(link);

		return link.num;
	}

	chain(a: string): string | null
	{
		const links = this.wordGraph[a];
		if(!links) return null;

		const w: number[] = [];
		for(let i = 0; i < links.length; ++i)
			w.push(links[i].num + (w[i - 1] || 0));
		
		const select = Math.random() * w[w.length - 1];

		return links[w.findIndex(v => v > select)].word;
	}

	digest(sentence: string)
	{
		const words = sentence.split(' ').filter(v => v.length > 0);

		const last = words.reduce((prev, curr) => {
			console.log(prev, curr);
			this.addLink(prev, curr);
			return curr;
		}, '');
		this.addLink(last, null);
	}

	generate(maxChain: number = 50)
	{
		let i = 0, word: string | null = '', words: string[] = [];
		while(word != null && i < maxChain)
		{
			word = this.chain(word);
			if(word) words.push(word);
			i++;
		}

		return words.join(' ');
	}
};