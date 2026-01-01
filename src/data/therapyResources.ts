// Static therapy resources data - no API call needed
export interface ResourceItem {
    id: string;
    title: string;
    content: string | null;
    duration: number | null;
    type: string;
}

export interface ResourceCategory {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    items: ResourceItem[];
}

export const therapyResources: ResourceCategory[] = [
    {
        id: 'chair-exercises',
        title: 'Chair-Based Exercise Video Series',
        description: 'Safe, Gentle, Effective. Designed for heart failure patients.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop',
        items: [
            {
                id: 'chair-1',
                title: 'Introduction and Safety',
                type: 'video',
                duration: 300,
                content: `Welcome to the heart health exercise and walking programme.

My name is Bilal, and I will guide you through safe, gentle, and effective activities to support your heart.

This programme is designed especially for people living with heart failure. All exercises can be done slowly and safely, many of them while sitting on a chair.

Before we begin, please remember these important safety rules.

Stop immediately if you feel chest pain, severe shortness of breath, dizziness, or if you feel unwell.

Start slowly and build up gradually over time.

It is normal to feel slightly breathless during exercise. You should still be able to talk comfortably.

Keep your emergency medication nearby.

Try to exercise at least two hours after eating.

Now take a moment to check how you are feeling today.

If you feel well and your breathing is normal, this is a green day.

If you have mild symptoms but feel manageable, this is a yellow day. Move gently and carefully.

If you have chest pain or severe symptoms, this is a red day. Do not exercise today.

If today feels like a green day, let us begin.`,
            },
            {
                id: 'chair-2',
                title: 'Warm-Up Routine',
                type: 'video',
                duration: 300,
                content: `Let us start with a gentle warm-up.

Sit comfortably with your feet flat on the floor.

Begin with deep breathing.

Breathe in slowly through your nose for four counts.

Hold for two counts.

Now breathe out gently through your mouth for four counts.

Repeat this breathing slowly and calmly.

Now move to shoulder rolls.

Lift your shoulders gently and roll them forward.

One. Two. Three. Four. Five.

Now roll them backward.

One. Two. Three. Four. Five.

Move slowly and stay relaxed.

Next, neck stretches.

Turn your head gently to the right. Hold for ten seconds.

Return to the center.

Now turn to the left. Hold for ten seconds.

Never force the movement.

Now arm circles.

Stretch your arms comfortably.

Make small circles forward.

One. Two. Three. Continue slowly.

Now reverse the direction.

If this feels difficult, you may move one arm at a time.

Now ankle pumps.

Point your toes upward. Then gently point them down.

Repeat this ten times for each foot.

Your body is now warm and ready.`,
            },
            {
                id: 'chair-3',
                title: 'Upper Body Strengthening',
                type: 'video',
                duration: 600,
                content: `Now we begin upper body strengthening.

You may use light weights or water bottles, but this is optional.

First, bicep curls.

Sit tall with your arms at your sides, palms facing forward.

Slowly bend your elbows and bring your hands toward your shoulders.

Breathe out as you lift.

Lower your arms slowly while breathing in.

Repeat ten to twelve times.

Rest briefly.

Next, arm raises.

Keep your arms at your sides.

Raise them gently to shoulder height, only as high as feels comfortable.

Lower slowly.

Repeat ten times.

Now chest squeeze.

Hold a small pillow or ball at chest level.

Gently squeeze and hold for five seconds.

Relax.

Repeat ten times.

If you do not have a pillow, press your palms together.

Now seated rowing.

Pull your elbows back as if rowing a boat.

Squeeze your shoulder blades together.

Move slowly and with control.

Repeat ten times.

Now shoulder press.

Bring your hands to shoulder level.

Press upward gently, only if comfortable.

Do not lock your elbows.

Repeat ten times.

Well done.`,
            },
            {
                id: 'chair-4',
                title: 'Lower Body Strengthening',
                type: 'video',
                duration: 600,
                content: `Now lower body strengthening.

Begin with seated marching.

Lift one knee, then the other, like slow walking.

Follow the count.

One. Two. Three. Four.

Lift only as high as feels comfortable.

Next, leg extensions.

Straighten one leg slowly. Hold for two seconds.

Lower it back down.

Repeat ten times, then change legs.

Now side leg lifts.

Sit tall and hold the chair.

Lift your leg gently to the side, just a few inches.

Lower slowly.

Repeat ten times on each side.

Now heel raises.

Keep your feet flat on the floor.

Lift your heels, pressing through your toes.

Hold for two seconds.

Lower slowly.

Repeat fifteen times.

Now seated squats.

Stand up slowly, then sit down with control.

Use your arms if needed.

Repeat five to ten times.

Excellent work.`,
            },
            {
                id: 'chair-5',
                title: 'Core Strengthening',
                type: 'video',
                duration: 480,
                content: `Now we will strengthen the core.

Begin with belly breathing.

Place one hand on your chest and one on your belly.

Breathe in slowly, feeling your belly rise.

Breathe out gently, engaging your core.

Imagine a balloon filling and emptying.

Repeat ten deep breaths.

Now seated twists.

Place your hands on your shoulders.

Gently twist to the right. Return to center.

Twist to the left.

Keep your hips facing forward.

Repeat eight times.

Now side bends.

Reach one arm down the side of the chair.

Lean gently to the side.

Feel the stretch.

Return to center.

Repeat on the other side.

Now leg slides.

Slide one foot forward, keeping your heel on the floor.

Pull it back slowly.

Keep your core engaged.

Repeat ten times on each leg.`,
            },
            {
                id: 'chair-6',
                title: 'Balance Exercises',
                type: 'video',
                duration: 480,
                content: `Now balance exercises.

Balance exercises help reduce the risk of falls.

Always have support nearby.

Stop if you feel unsteady.

All exercises can be done seated.

Begin with gentle weight shifts from side to side.

Now lift one foot slightly off the floor. Hold briefly.

Lower and change sides.

Now heel to toe movements.

Move slowly and stay controlled.

Now reaching exercises.

Reach forward. Return.

Reach to the side. Return.

Stay balanced.`,
            },
            {
                id: 'chair-7',
                title: 'Flexibility and Stretching',
                type: 'video',
                duration: 600,
                content: `Now flexibility and stretching.

Move gently and never force a stretch.

Stretch your neck slowly.

Relax your shoulders.

Stretch one arm across your body.

Hold and breathe.

Gently twist your spine.

Circle your ankles slowly.

Stretch your calves gently.`,
            },
            {
                id: 'chair-8',
                title: 'Cool-Down Routine',
                type: 'video',
                duration: 300,
                content: `Now let us cool down.

March slowly in place.

Swing your arms gently.

Take slow, deep breaths.

Relax your body.

You have done something positive for your heart today.`,
            },
            {
                id: 'chair-9',
                title: 'Walking Programme',
                type: 'video',
                duration: 300,
                content: `Walking is also an excellent way to support heart health.

Wear comfortable shoes.

Choose safe walking areas.

Walk with your head up and shoulders relaxed.

Swing your arms naturally.

Step heel to toe.

Walk at a pace where you can still talk.

If you cannot talk, slow down.

Stop walking if you feel unwell.`,
            },
            {
                id: 'chair-10',
                title: 'Understanding Your Heart',
                type: 'video',
                duration: 300,
                content: `Now let us understand your heart.

Your heart works like a water pump.

It moves blood through your body.

In heart failure, the pump becomes weaker.

Exercise and medication help the heart work better.

Some medicines widen blood vessels.

Some slow the heart rate.

Some remove extra fluid.

Taking your medicine correctly helps protect your heart.

Thank you for taking time to care for your health.

Move gently. Stay consistent. And listen to your body.`,
            },
        ],
    },
    {
        id: 'walking-program',
        title: 'Walking Programme Video Series',
        description: 'Step-by-step guide to starting a safe walking routine.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2670&auto=format&fit=crop',
        items: [
            {
                id: 'walking-1',
                title: 'Getting Started with Walking',
                type: 'video',
                duration: 300,
                content: `Walking is excellent for heart health.

It helps strengthen your heart and improves your overall wellbeing.

Before you begin walking, make sure you have proper footwear that supports your feet.

Find safe walking areas where you feel comfortable and secure.

Start slowly and build up gradually over time.

You can use a step counter or phone app to track your progress.

Remember to listen to your body and stop if you feel unwell.`,
            },
            {
                id: 'walking-2',
                title: 'Proper Walking Technique',
                type: 'video',
                duration: 300,
                content: `Let us learn the proper way to walk.

Keep your head up and your shoulders relaxed.

Swing your arms naturally, bent at about ninety degrees.

Place your feet heel to toe with each step.

Breathe regularly and do not hold your breath.

Walk at a pace where you can still talk comfortably.

If you cannot talk while walking, slow down your pace.

Move smoothly and stay relaxed throughout your walk.`,
            },
            {
                id: 'walking-3',
                title: 'Monitoring Your Walking Intensity',
                type: 'video',
                duration: 300,
                content: `It is important to monitor how hard you are working while walking.

The talk test is a simple way to check your intensity.

You should be able to talk comfortably while walking.

If you cannot talk, you are walking too fast. Slow down.

Pay attention to how your body feels.

If you feel unwell, stop walking immediately.

Rest and recover between your walks.

Track your progress over time to see how you are improving.`,
            },
            {
                id: 'walking-4',
                title: 'Walking in Different Conditions',
                type: 'video',
                duration: 300,
                content: `Walking in different weather conditions requires some precautions.

In hot weather, walk during cooler times of day.

Stay hydrated and take breaks in the shade.

After rain, be careful of wet and slippery surfaces.

If outdoor walking is not possible, consider indoor alternatives.

Mall walking is a great option when weather is poor.

You can also walk in place at home.

If you need support, use walking aids like a cane or walker.

Always prioritize your safety and comfort.`,
            },
        ],
    },
    {
        id: 'educational-series',
        title: 'Educational Animation Series',
        description: 'Understanding your heart and condition.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2630&auto=format&fit=crop',
        items: [
            {
                id: 'edu-1',
                title: 'How Your Heart Works',
                type: 'video',
                duration: 180,
                content: `Let us understand how your heart works.

Your heart works like a water pump in your home.

It pumps blood through your body, delivering oxygen and nutrients to all your organs.

The heart has four chambers that work together to keep blood flowing.

In heart failure, this pump becomes weaker and cannot pump blood as effectively.

This is why you may feel tired or short of breath.

But with proper care, exercise, and medication, your heart can work better.

Understanding your heart helps you take better care of it.`,
            },
            {
                id: 'edu-2',
                title: 'Understanding Heart Failure',
                type: 'video',
                duration: 180,
                content: `Let us understand heart failure better.

When the heart pump becomes weaker, it cannot pump blood as well as it should.

This can cause fluid to build up in your body.

You may notice swelling in your ankles or feel short of breath.

This happens because the weakened heart cannot move blood efficiently.

Medications help by removing extra fluid and helping the heart work better.

Exercise also strengthens the heart muscle over time.

Understanding why symptoms occur helps you manage them better.

Remember, with proper care, you can live well with heart failure.`,
            },
            {
                id: 'edu-3',
                title: 'Medication Actions',
                type: 'video',
                duration: 240,
                content: `Let us understand how your medications work.

ACE inhibitors work like pipe wideners. They widen your blood vessels, making it easier for blood to flow.

This reduces the work your heart has to do.

Beta-blockers are like heart rate controllers. They slow down your heart rate, giving your heart time to rest between beats.

This helps your heart work more efficiently.

Diuretics are like excess water removers. They help your body get rid of extra fluid.

This reduces swelling and helps you breathe easier.

It is very important to take your medications at the right time.

Taking your medicine correctly helps protect your heart and keeps you feeling well.

Always follow your doctor's instructions for your medications.`,
            },
        ],
    },
];

