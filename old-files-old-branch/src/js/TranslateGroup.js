export default class TranslationGroup {
  constructor(two,c, r, translation) {
    this.two = two;
    this.c = c;
    this.r = r;
    this.translation = translation;
    this.soup = 400;
  }

  create(){
    console.log("created")
    this.group = this.two.makeGroup(this.c,this.r)
  }

  decrement() {
    this.translation--;
    this.group.translation.set(0,this.translation)
  }
}
