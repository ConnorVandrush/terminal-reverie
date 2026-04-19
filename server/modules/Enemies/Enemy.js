class Enemy
{
    constructor()
    {

    }
    
    pickLivingTarget(allyList)
    {
        const livingIndexes = allyList
            .map((a, i) => (!a.isDead ? i : null))
            .filter(i => i !== null);

        if (livingIndexes.length === 0) return null;

        const random = this.randInt(0, livingIndexes.length - 1);
        return livingIndexes[random];
    }
}

module.exports = Enemy;