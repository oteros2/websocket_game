import { Animated, Easing, View, Button, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Sprites, type SpritesMethods } from 'react-native-sprites';

const Tamagotchi = () => {
    const [positionAnim] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState('down');
    const [isMoving, setIsMoving] = useState(false);
    const spriteRef = useRef<Array<SpritesMethods | null>>([]);

    useEffect(() => {
        if (spriteRef.current[0] != null)
            spriteRef.current[0].play({
                type: direction,
                fps: 8,
                loop: true
            });
    }, [direction]);

    const move = () => {
        if (isMoving) return;

        setIsMoving(true);
        const { x, y } = position;

        let newX = x;
        let newY = y;

        switch (direction) {
            case 'up':
                newY -= 50;
                break;
            case 'down':
                newY += 50;
                break;
            case 'left':
                newX -= 50;
                break;
            case 'right':
                newX += 50;
                break;
        }

        Animated.timing(positionAnim, {
            toValue: { x: newX, y: newY },
            easing: Easing.ease,
            duration: 500,
            useNativeDriver: true, 
        }).start(() => {
            setIsMoving(false);
            setPosition({ x: newX, y: newY });
        });
    };

    const rotate = () => {
        const directions = ['down', 'left', 'up', 'right'];
        const currentIndex = directions.indexOf(direction);
        const nextIndex = (currentIndex + 1) % directions.length;
        setDirection(directions[nextIndex]);
    };

    return (
        <View style={styles.container}>
            <Animated.View                 
                style={{
                    transform: [{ translateX: positionAnim.x }, { translateY: positionAnim.y }]
                }}
            >
                <Sprites
                    ref={(ref) => spriteRef.current.push(ref)}
                    source={require('../assets/tamagot1.jpg')}
                    columns={12}
                    rows={8}
                    animations={{
                        down: { row: 0, startFrame: 0, endFrame: 2 },
                        left: { row: 1, startFrame: 0, endFrame: 2 },
                        right: { row: 2, startFrame: 0, endFrame: 2 },
                        up: { row: 3, startFrame: 0, endFrame: 2 },
                    }}
                />
            </Animated.View>
            <View style={styles.buttonContainer}>
                <Button title="Rotate" onPress={rotate} disabled={isMoving} />
                <Button title="Move" onPress={move} disabled={isMoving} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom:-690,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '35%',
    },
});

export default Tamagotchi