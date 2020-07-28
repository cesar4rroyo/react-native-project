import React, { Component } from "react";
import { View, FlatList, Text, ScrollView, Button, StyleSheet, Modal, Alert, PanResponder } from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
})





function RenderDish(props) {

    const dish = props.dish;

    // handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    }

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx < 200)
            return true;
        else
            return false
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        // onPanResponderGrant: () => { this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled')); },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
                    ],
                    { cancelable: false }
                )
            if (recognizeComment(gestureState)) {
                props.toggleModal
            }
            return true;
        }
    })

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                // ref={this.handleViewRef}
                {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={{ justifyContent: "center", flexDirection: "row" }}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name={"pencil"}
                            type="font-awesome"
                            color="#512DA8"
                            onPress={props.toggleModal}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            showModal: false,
            author: "",
            comment: "",
            rating: "",
        }
        this.toggleModal = this.toggleModal.bind(this)
    }


    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: "Dish Details"
    }


    toggleModal() {
        this.setState({ showModal: true })
    }

    handleComment(dishId, rating, author, comment) {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
        this.props.postComment(dishId, rating, author, comment)
    }

    resetForm() {
        this.setState({
            showModal: false
        });
    }


    render() {
        const dishId = this.props.navigation.getParam("dishId", "")
        return (<ScrollView>
            <Modal animationType={"slide"} transparent={false}
                visible={this.state.showModal}
                onDismiss={() => this.toggleModal()}
                onRequestClose={() => this.toggleModal()}>
                <View style={styles.modal}>
                    <Rating showRating fractions="{1}" startingValue="{4}"
                        onFinishRating={(value) => this.setState({ rating: value })}

                    />
                    <Input
                        placeholder='Author'

                        leftIcon={
                            <Icon
                                name='user'
                                size={24}
                                color='black'
                                type='font-awesome'

                            />
                        }
                        value={this.state.author}
                        onChangeText={text => this.setState({ author: text })}


                    />
                    <Input
                        placeholder='Comment'
                        leftIcon={
                            <Icon
                                name='comment'
                                size={24}
                                color='black'
                                type='font-awesome'
                            />
                        }
                        onChangeText={text => this.setState({ comment: text })}
                        value={this.state.comment}


                    />
                    <Button
                        onPress={() => { this.toggleModal(); this.resetForm(); this.handleComment(dishId, this.state.rating, this.state.author, this.state.comment) }}
                        color="#512DA8"
                        title="Submit"
                    />
                    <Button
                        onPress={() => { this.toggleModal() }}
                        color="grey"
                        title="Cancel"
                    />

                </View>
            </Modal>
            <RenderDish dish={this.props.dishes.dishes[+dishId]}
                favorite={this.props.favorites.some(el => el === dishId)}
                onPress={() => this.markFavorite(dishId)}
                toggleModal={this.toggleModal}

            />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
        </ScrollView>);
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20

    },




});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);