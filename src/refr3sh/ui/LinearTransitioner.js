/**
 * Created by 7daysofrain on 1/2/15.
 */
/**

 USAGE

 transition classes must be found in styles/linear-transitions.css
 original code/transitions from http://tympanus.net/Development/PageTransitions/

 var secNav = new LinearTransitioner(
 $(sec),
 {
	leftOut: "pt-page-moveToLeftEasing pt-page-ontop",
	leftIn: "pt-page-moveFromRight",
	rightOut: "pt-page-moveToRightEasing pt-page-ontop",
	rightIn: "pt-page-moveFromLeft"
}
 );
 secNav.changed.add(function(index){
    console.log("index changed: " + index)
 });

 Animation objets can be passed this way too:

 {
 	left: LinearTransitioner.CAROUSEL_TO_LEFT
 	right: LinearTransitioner.CAROUSEL_TO_RIGHT
 }

 */
define(['signals','jQuery','modernizr'], function(Signal)
{

	var animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
	// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
	// support css animations
		support = Modernizr.cssanimations;

	var LinearTransitioner = function(el,anims){
		if(anims.hasOwnProperty("left")){
			var anims2 =  {
				leftOut: anims.left.outClass,
				leftIn: anims.left.inClass,
				rightOut: anims.right.outClass,
				rightIn: anims.right.inClass
			};
		}
		this.$element = $(el);
		this.$pages = this.$element.children();
		this.current = 0;
		this.isAnimating = false;
		this.endCurrPage = false;
		this.endNextPage = false;
		this.anims = anims2 || anims;
		this.changed = new Signal();

		this.$pages.addClass("pt-page").each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) || "" );
		} );

		this.$pages.eq( this.current ).addClass( 'pt-page-current' );
	};
	LinearTransitioner.prototype.goto = function(index,disableAnimation){

		if( this.isAnimating || this.current == index) {
			return false;
		}

		this.isAnimating = true;

		var $currPage = this.$pages.eq( this.current );


		var outClass = this.current < index ? this.anims.leftOut : this.anims.rightOut;
		var inClass = this.current < index ? this.anims.leftIn : this.anims.rightIn;
		this.current = index;
		var $nextPage = this.$pages.eq( this.current ).addClass( 'pt-page-current' );
		this.changed.dispatch(this.current);

		var scope = this;
		if( !support || disableAnimation) {
			this._onEndAnimation( $currPage, $nextPage );
			return;
		}
		$currPage.addClass( outClass ).one( animEndEventName, function() {
			scope.endCurrPage = true;
			if( scope.endNextPage ) {
				scope._onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.removeClass("pt-page-hidden").addClass( inClass ).one( animEndEventName, function() {
			scope.endNextPage = true;
			if( scope.endCurrPage ) {
				scope._onEndAnimation( $currPage, $nextPage );
			}
		} );
	};


	LinearTransitioner.prototype._onEndAnimation = function( $outpage, $inpage ) {
		setTimeout(function(){
			this.endCurrPage = false;
			this.endNextPage = false;
			this._resetPage( $outpage, $inpage );
			this.isAnimating = false;
		}.bind(this),300);
	}

	LinearTransitioner.prototype._resetPage = function( $outpage, $inpage ) {
		console.log("reset");
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) + ' pt-page-hidden' );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}
	LinearTransitioner.prototype.next = function(){
		if(this.current < this.$pages.length-1){
			this.goto(this.current+1);
		}
	};
	LinearTransitioner.prototype.prev = function(){
		if(this.current > 0){
			this.goto(this.current-1);
		}
	};
	LinearTransitioner.MOVE_TO_LEFT_FROM_RIGHT = {
		outClass: 'pt-page-moveToLeft',
		inClass: 'pt-page-moveFromRight'
	};
	LinearTransitioner.MOVE_TO_RIGHT_FROM_LEFT = {
		outClass: 'pt-page-moveToRight',
		inClass: 'pt-page-moveFromLeft'
	};
	LinearTransitioner.MOVE_TO_TOP_FROM_BOTTOM = {
		outClass: 'pt-page-moveToTop',
		inClass: 'pt-page-moveFromBottom'
	};
	LinearTransitioner.MOVE_TO_BOTTOM_FROM_TOP = {
		outClass: 'pt-page-moveToBottom',
		inClass: 'pt-page-moveFromTop'
	};
	LinearTransitioner.FADE_FROM_RIGHT = {
		outClass: 'pt-page-fade',
		inClass: 'pt-page-moveFromRight pt-page-ontop'
	};
	LinearTransitioner.FADE_FROM_LEFT = {
		outClass: 'pt-page-fade',
		inClass: 'pt-page-moveFromLeft pt-page-ontop'
	};
	LinearTransitioner.FADE_FROM_BOTTOM = {
		outClass: 'pt-page-fade',
		inClass: 'pt-page-moveFromBottom pt-page-ontop'
	};
	LinearTransitioner.FADE_FROM_TOP = {
		outClass: 'pt-page-fade',
		inClass: 'pt-page-moveFromTop pt-page-ontop'
	};
	LinearTransitioner.FADE_LEFT_FADE_RIGHT = {
		outClass: 'pt-page-moveToLeftFade',
		inClass: 'pt-page-moveFromRightFade'
	};
	LinearTransitioner.FADE_RIGHT_FADE_LEFT = {
		outClass: 'pt-page-moveToRightFade',
		inClass: 'pt-page-moveFromLeftFade'
	};
	LinearTransitioner.FADE_TOP_FADE_BOTTOM = {
		outClass: 'pt-page-moveToTopFade',
		inClass: 'pt-page-moveFromBottomFade'
	};
	LinearTransitioner.FADE_BOTTOM_FADE_TOP = {
		outClass: 'pt-page-moveToBottomFade',
		inClass: 'pt-page-moveFromTopFade'
	};
	LinearTransitioner.DIFFERENTE_EASING_FROM_RIGHT = {
		outClass: 'pt-page-moveToLeftEasing pt-page-ontop',
		inClass: 'pt-page-moveFromRight'
	};
	LinearTransitioner.DIFFERENTE_EASING_FROM_LEFT = {
		outClass: 'pt-page-moveToRightEasing pt-page-ontop',
		inClass: 'pt-page-moveFromLeft'
	};
	LinearTransitioner.DIFFERENTE_EASING_FROM_BOTTOM = {
		outClass: 'pt-page-moveToTopEasing pt-page-ontop',
		inClass: 'pt-page-moveFromBottom'
	};
	LinearTransitioner.DIFFERENTE_EASING_FROM_TOP = {
		outClass: 'pt-page-moveToBottomEasing pt-page-ontop',
		inClass: 'pt-page-moveFromTop'
	};
	LinearTransitioner.SCALE_DOWN_FROM_RIGHT = {
		outClass: 'pt-page-scaleDown',
		inClass: 'pt-page-moveFromRight pt-page-ontop'
	};
	LinearTransitioner.SCALE_DOWN_FROM_LEFT = {
		outClass: 'pt-page-scaleDown',
		inClass: 'pt-page-moveFromLeft pt-page-ontop'
	};
	LinearTransitioner.SCALE_DOWN_FROM_BOTTOM = {
		outClass: 'pt-page-scaleDown',
		inClass: 'pt-page-moveFromBottom pt-page-ontop'
	};
	LinearTransitioner.SCALE_DOWN_FROM_TOP = {
		outClass: 'pt-page-scaleDown',
		inClass: 'pt-page-moveFromTop pt-page-ontop'
	};
	LinearTransitioner.SCALE_DOWN_SCALE_DOWN = {
		outClass: 'pt-page-scaleDown',
		inClass: 'pt-page-scaleUpDown pt-page-delay300'
	};
	LinearTransitioner.SCALE_UP_SCALE_UP = {
		outClass: 'pt-page-scaleDownUp',
		inClass: 'pt-page-scaleUp pt-page-delay300'
	};
	LinearTransitioner.MOVE_TO_LEFT_SCALE_UP = {
		outClass: 'pt-page-moveToLeft pt-page-ontop',
		inClass: 'pt-page-scaleUp'
	};
	LinearTransitioner.MOVE_TO_RIGHT_SCALE_UP = {
		outClass: 'pt-page-moveToRight pt-page-ontop',
		inClass: 'pt-page-scaleUp'
	};
	LinearTransitioner.MOVE_TO_TOP_SCALE_UP = {
		outClass: 'pt-page-moveToTop pt-page-ontop',
		inClass: 'pt-page-scaleUp'
	};
	LinearTransitioner.MOVE_TO_BOTTOM_SCALE_UP = {
		outClass: 'pt-page-moveToBottom pt-page-ontop',
		inClass: 'pt-page-scaleUp'
	};
	LinearTransitioner.SCALE_DOWN_SCALE_UP = {
		outClass: 'pt-page-scaleDownCenter',
		inClass: 'pt-page-scaleUpCenter pt-page-delay400'
	};
	LinearTransitioner.GLUE_LEFT_FROM_RIGHT = {
		outClass: 'pt-page-rotateRightSideFirst',
		inClass: 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop'
	};
	LinearTransitioner.GLUE_RIGHT_FROM_LEFT = {
		outClass: 'pt-page-rotateLeftSideFirst',
		inClass: 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop'
	};
	LinearTransitioner.GLUE_BOTTOM_FROM_TOP = {
		outClass: 'pt-page-rotateTopSideFirst',
		inClass: 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop'
	};
	LinearTransitioner.GLUE_TOP_FROM_BOTTOM = {
		outClass: 'pt-page-rotateBottomSideFirst',
		inClass: 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop'
	};
	LinearTransitioner.FLIP_RIGHT = {
		outClass: 'pt-page-flipOutRight',
		inClass: 'pt-page-flipInLeft pt-page-delay500'
	};
	LinearTransitioner.FLIP_LEFT = {
		outClass: 'pt-page-flipOutLeft',
		inClass: 'pt-page-flipInRight pt-page-delay500'
	};
	LinearTransitioner.FLIP_TOP = {
		outClass: 'pt-page-flipOutTop',
		inClass: 'pt-page-flipInBottom pt-page-delay500'
	};
	LinearTransitioner.FLIP_BOTTOM = {
		outClass: 'pt-page-flipOutBottom',
		inClass: 'pt-page-flipInTop pt-page-delay500'
	};
	LinearTransitioner.FALL = {
		outClass: 'pt-page-rotateFall pt-page-ontop',
		inClass: 'pt-page-scaleUp'
	};
	LinearTransitioner.NEWSPAPER = {
		outClass: 'pt-page-rotateOutNewspaper',
		inClass: 'pt-page-rotateInNewspaper pt-page-delay500'
	};
	LinearTransitioner.PUSH_LEFT_FROM_RIGHT = {
		outClass: 'pt-page-rotatePushLeft',
		inClass: 'pt-page-moveFromRight'
	};
	LinearTransitioner.PUSH_RIGHT_FROM_LEFT = {
		outClass: 'pt-page-rotatePushRight',
		inClass: 'pt-page-moveFromLeft'
	};
	LinearTransitioner.PUSH_TOP_FROM_BOTTOM = {
		outClass: 'pt-page-rotatePushTop',
		inClass: 'pt-page-moveFromBottom'
	};
	LinearTransitioner.PUSH_BOTTOM_FROM_TOP = {
		outClass: 'pt-page-rotatePushBottom',
		inClass: 'pt-page-moveFromTop'
	};
	LinearTransitioner.PUSH_LEFT_PULL_RIGHT = {
		outClass: 'pt-page-rotatePushLeft',
		inClass: 'pt-page-rotatePullRight pt-page-delay180'
	};
	LinearTransitioner.PUSH_RIGHT_PULL_LEFT = {
		outClass: 'pt-page-rotatePushRight',
		inClass: 'pt-page-rotatePullLeft pt-page-delay180'
	};
	LinearTransitioner.PUSH_TOP_PULL_BOTTOM = {
		outClass: 'pt-page-rotatePushTop',
		inClass: 'pt-page-rotatePullBottom pt-page-delay180'
	};
	LinearTransitioner.PUSH_BOTTOM_PULL_TOP = {
		outClass: 'pt-page-rotatePushBottom',
		inClass: 'pt-page-rotatePullTop pt-page-delay180'
	};
	LinearTransitioner.FOLD_LEFT_FROM_RIGHT = {
		outClass: 'pt-page-rotateFoldLeft',
		inClass: 'pt-page-moveFromRightFade'
	};
	LinearTransitioner.FOLD_RIGHT_FROM_LEFT = {
		outClass: 'pt-page-rotateFoldRight',
		inClass: 'pt-page-moveFromLeftFade'
	};
	LinearTransitioner.FOLD_TOP_FROM_BOTTOM = {
		outClass: 'pt-page-rotateFoldTop',
		inClass: 'pt-page-moveFromBottomFade'
	};
	LinearTransitioner.FOLD_BOTTOM_FROM_TOP= {
		outClass: 'pt-page-rotateFoldBottom',
		inClass: 'pt-page-moveFromTopFade'
	};
	LinearTransitioner.MOVE_TO_RIGHT_UNFOLD_LEFT = {
		outClass: 'pt-page-moveToRightFade',
		inClass: 'pt-page-rotateUnfoldLeft'
	};
	LinearTransitioner.MOVE_TO_LEFT_UNFOLD_RIGHT = {
		outClass: 'pt-page-moveToLeftFade',
		inClass: 'pt-page-rotateUnfoldRight'
	};
	LinearTransitioner.MOVE_TO_BOTTOM_UNFOLD_TOP = {
		outClass: 'pt-page-moveToBottomFade',
		inClass: 'pt-page-rotateUnfoldTop'
	};
	LinearTransitioner.MOVE_TO_TOP_UNFOLD_BOTTOM = {
		outClass: 'pt-page-moveToTopFade',
		inClass: 'pt-page-rotateUnfoldBottom'
	};
	LinearTransitioner.ROOM_TO_LEFT = {
		outClass: 'pt-page-rotateRoomLeftOut pt-page-ontop',
		inClass: 'pt-page-rotateRoomLeftIn'
	};
	LinearTransitioner.ROOM_TO_RIGHT = {
		outClass: 'pt-page-rotateRoomRightOut pt-page-ontop',
		inClass: 'pt-page-rotateRoomRightIn'
	};
	LinearTransitioner.ROOM_TO_TOP = {
		outClass: 'pt-page-rotateRoomTopOut pt-page-ontop',
		inClass: 'pt-page-rotateRoomTopIn'
	};
	LinearTransitioner.ROOM_TO_BOTTOM = {
		outClass: 'pt-page-rotateRoomBottomOut pt-page-ontop',
		inClass: 'pt-page-rotateRoomBottomIn'
	};
	LinearTransitioner.CUBE_TO_LEFT = {
		outClass: 'pt-page-rotateCubeLeftOut pt-page-ontop',
		inClass: 'pt-page-rotateCubeLeftIn'
	};
	LinearTransitioner.CUBE_TO_RIGHT = {
		outClass: 'pt-page-rotateCubeRightOut pt-page-ontop',
		inClass: 'pt-page-rotateCubeRightIn'
	};
	LinearTransitioner.CUBE_TO_TOP = {
		outClass: 'pt-page-rotateCubeTopOut pt-page-ontop',
		inClass: 'pt-page-rotateCubeTopIn'
	};
	LinearTransitioner.CUBE_TO_BOTTOM = {
		outClass: 'pt-page-rotateCubeBottomOut pt-page-ontop',
		inClass: 'pt-page-rotateCubeBottomIn'
	};
	LinearTransitioner.CAROUSEL_TO_LEFT = {
		outClass: 'pt-page-rotateCarouselLeftOut pt-page-ontop',
		inClass: 'pt-page-rotateCarouselLeftIn'
	};
	LinearTransitioner.CAROUSEL_TO_RIGHT = {
		outClass: 'pt-page-rotateCarouselRightOut pt-page-ontop',
		inClass: 'pt-page-rotateCarouselRightIn'
	};
	LinearTransitioner.CAROUSEL_TO_TOP = {
		outClass: 'pt-page-rotateCarouselTopOut pt-page-ontop',
		inClass: 'pt-page-rotateCarouselTopIn'
	};
	LinearTransitioner.CAROUSEL_TO_BOTTOM = {
		outClass: 'pt-page-rotateCarouselBottomOut pt-page-ontop',
		inClass: 'pt-page-rotateCarouselBottomIn'
	};
	LinearTransitioner.SIDES = {
		outClass: 'pt-page-rotateSidesOut',
		inClass: 'pt-page-rotateSidesIn pt-page-delay200'
	};
	LinearTransitioner.SLIDE = {
		outClass: 'pt-page-rotateSlideOut',
		inClass: 'pt-page-rotateSlideIn'
	};
	return LinearTransitioner;
});
